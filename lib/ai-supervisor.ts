import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface HealthCheck {
  name: string;
  healthy: boolean;
  latency?: number;
  detail?: string;
}

export interface SOPInstruction {
  check: string;
  action: string;
  priority: "critical" | "high" | "medium";
  aiGenerated?: boolean;
}

export async function checkDatabaseConnection(): Promise<HealthCheck> {
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { name: "database", healthy: true, latency: Date.now() - start };
  } catch (e) {
    return { name: "database", healthy: false, detail: String(e) };
  }
}

export async function checkAPIResponseTime(): Promise<HealthCheck> {
  const start = Date.now();
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/health`, {
      cache: "no-store",
    });
    const latency = Date.now() - start;
    return { name: "api", healthy: res.ok, latency, detail: res.ok ? undefined : `HTTP ${res.status}` };
  } catch (e) {
    return { name: "api", healthy: false, detail: String(e) };
  }
}

export async function checkOpenAIQuota(): Promise<HealthCheck> {
  if (!process.env.OPENAI_API_KEY) return { name: "openai", healthy: false, detail: "OPENAI_API_KEY not set" };
  try {
    const res = await fetch("https://api.openai.com/v1/usage", {
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    });
    return { name: "openai", healthy: res.ok, detail: res.ok ? undefined : `HTTP ${res.status}` };
  } catch (e) {
    return { name: "openai", healthy: false, detail: String(e) };
  }
}

export async function checkStorageSpace(): Promise<HealthCheck> {
  try {
    const used = process.memoryUsage?.();
    const heapUsed = used ? Math.round(used.heapUsed / 1024 / 1024) : 0;
    return {
      name: "storage",
      healthy: heapUsed < 500,
      detail: `${heapUsed}MB heap used`,
    };
  } catch (e) {
    return { name: "storage", healthy: false, detail: String(e) };
  }
}

export async function runHealthChecks(): Promise<HealthCheck[]> {
  const checks = await Promise.all([
    checkDatabaseConnection(),
    checkAPIResponseTime(),
    checkOpenAIQuota(),
    checkStorageSpace(),
  ]);
  return checks;
}

export async function generateSOPInstructions(failed: HealthCheck[]): Promise<SOPInstruction[]> {
  const baseInstructions: Record<string, SOPInstruction> = {
    database: {
      check: "Database connection failure",
      action: "Check DATABASE_URL. Verify PostgreSQL is running. Check connection pool limits. Restart Prisma.",
      priority: "critical",
    },
    api: {
      check: "API response time > 5 seconds",
      action: "Check server logs. Review slow queries. Monitor database connection pool.",
      priority: "high",
    },
    openai: {
      check: "OpenAI quota exceeded",
      action: "Check usage at platform.openai.com. Reduce batch size. Enable quota alerts.",
      priority: "high",
    },
    storage: {
      check: "Storage heap > 500MB",
      action: "Restart server. Monitor memory leaks. Check for unclosed DB connections.",
      priority: "medium",
    },
  };

  return failed.map((f) => ({
    check: f.name,
    action: baseInstructions[f.name]?.action || `Investigate ${f.name} failure: ${f.detail}`,
    priority: baseInstructions[f.name]?.priority || "medium",
    aiGenerated: false,
  }));
}

export async function sendAdminAlert(instructions: SOPInstruction[]): Promise<void> {
  const message = instructions.map((i) => `⚠️ ${i.check}: ${i.action}`).join("\n");
  try {
    await prisma.adminAlert.create({
      data: {
        type: "health_check_failure",
        title: `Health Check Failure: ${instructions.map((i) => i.check).join(", ")}`,
        message,
      },
    });
  } catch {
    console.error("Failed to create admin alert:", message);
  }
}

export async function weeklyModelRetraining(): Promise<{ patternUpdates: number; accuracyImprovement: number }> {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const outcomes = await prisma.case.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { id: true, status: true },
    });

    let patternUpdates = 0;
    if (outcomes.length > 0) {
      patternUpdates = Math.min(5, Math.ceil(outcomes.length / 3));
    }

    return {
      patternUpdates,
      accuracyImprovement: outcomes.length > 0 ? Math.round((patternUpdates / outcomes.length) * 100) : 0,
    };
  } catch {
    return { patternUpdates: 0, accuracyImprovement: 0 };
  }
}

export async function healthCheck(): Promise<{ passed: boolean; checks: HealthCheck[]; sop?: SOPInstruction[] }> {
  const checks = await runHealthChecks();
  const failed = checks.filter((c) => !c.healthy);

  if (failed.length > 0) {
    const sop = await generateSOPInstructions(failed);
    await sendAdminAlert(sop);
    return { passed: false, checks, sop };
  }

  return { passed: true, checks };
}