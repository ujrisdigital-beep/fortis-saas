// app/api/diagnostics/unified/route.ts
// Unified system health diagnostic API — DB, APIs, routes, env, resources
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { getBillingSnapshot } from "@/lib/auto-billing";
import { authOptions, requireRole, type AppRole } from "@/lib/auth";

const prisma = new PrismaClient();
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface HealthCheck {
  name: string;
  status: "pass" | "fail" | "warn";
  latency?: number;
  details?: Record<string, unknown>;
  lastChecked: string;
}

function generateRecommendations(checks: HealthCheck[]): string[] {
  const recommendations: string[] = [];

  const envCheck = checks.find(c => c.name === "Environment Variables");
  const missingEnv = (envCheck?.details?.vars as Array<{ name: string; status: string; required: boolean }> | undefined)
    ?.filter(e => e.required && e.status === "missing");
  if (missingEnv?.length) {
    recommendations.push(`Add missing environment variables: ${missingEnv.map(e => e.name).join(", ")}`);
  }

  const failedApis = checks.filter(c => c.name.startsWith("API:") && c.status === "fail");
  if (failedApis.length) {
    recommendations.push(`Fix failed API endpoints: ${failedApis.map(c => c.name).join(", ")}`);
  }

  const failedRoutes = checks.filter(c => c.name.startsWith("Route:") && c.status === "fail");
  if (failedRoutes.length) {
    recommendations.push(`Fix failed routes: ${failedRoutes.map(c => c.name).join(", ")}`);
  }

  const adminCheck = checks.find(c => c.name === "Super Admin Accounts");
  if (adminCheck?.status === "warn") {
    recommendations.push("Create additional SUPER_ADMIN accounts — fewer than 3 found.");
  }

  return recommendations;
}

function splitCsv(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

async function canViewBilling(req: Request): Promise<boolean> {
  const adminHeader = req.headers.get("x-admin-key");
  const adminSecret = process.env.ADMIN_SECRET_KEY ?? process.env.ADMIN_SECRET;

  if (adminSecret && adminHeader === adminSecret) {
    return true;
  }

  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role as AppRole | undefined;
  const email = session?.user?.email?.toLowerCase();

  if (requireRole(role, ["SUPER_ADMIN", "CEO", "BOARD"])) {
    return true;
  }

  const allowlistedEmails = new Set([
    ...splitCsv(process.env.BILLING_ALERT_EMAILS),
    ...splitCsv(process.env.ADMIN_EMAIL),
  ]);

  return email ? allowlistedEmails.has(email) : false;
}

export async function GET(req: Request) {
  const checks: HealthCheck[] = [];
  const startTime = Date.now();
  const url = new URL(req.url);
  const billingRequested = url.searchParams.get("scope") === "billing" || url.searchParams.get("includeBilling") === "1";

  // ============================================
  // 1. DATABASE HEALTH (Neon PostgreSQL)
  // ============================================
  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1 as connected`;
    const userCount = await prisma.user.count();
    const programCount = await prisma.trainingProgram.count().catch(() => 0);
    const orderCount = await (prisma as PrismaClient & { marketplaceOrder?: { count: () => Promise<number> } })
      .marketplaceOrder?.count().catch(() => 0) ?? 0;
    const dbLatency = Date.now() - dbStart;

    checks.push({
      name: "Database Connection",
      status: "pass",
      latency: dbLatency,
      details: {
        users: userCount,
        trainingPrograms: programCount,
        orders: orderCount,
        provider: "Neon PostgreSQL (EU-West-2)",
      },
      lastChecked: new Date().toISOString(),
    });
  } catch (error) {
    checks.push({
      name: "Database Connection",
      status: "fail",
      details: { error: String(error) },
      lastChecked: new Date().toISOString(),
    });
  }

  // ============================================
  // 2. API HEALTH (Critical Endpoints)
  // ============================================
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  const endpoints = [
    { name: "Health Check", url: "/api/health", method: "GET" },
    { name: "Auth Session", url: "/api/auth/session", method: "GET" },
    { name: "Training Stats", url: "/api/training/stats", method: "GET" },
    { name: "TANGO Members", url: "/api/tango/members", method: "GET" },
    { name: "Content Fetch", url: "/api/admin/content-fetch", method: "GET" },
  ];

  for (const endpoint of endpoints) {
    const start = Date.now();
    try {
      const res = await fetch(`${baseUrl}${endpoint.url}`, {
        method: endpoint.method,
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(5000),
      });
      const latency = Date.now() - start;
      checks.push({
        name: `API: ${endpoint.name}`,
        status: res.ok ? "pass" : "warn",
        latency,
        details: { httpStatus: res.status, url: endpoint.url },
        lastChecked: new Date().toISOString(),
      });
    } catch (error) {
      checks.push({
        name: `API: ${endpoint.name}`,
        status: "warn",
        details: { error: String(error), note: "May be unreachable server-side in some environments" },
        lastChecked: new Date().toISOString(),
      });
    }
  }

  // ============================================
  // 3. ENVIRONMENT VARIABLES
  // ============================================
  const requiredEnvVars = [
    "DATABASE_URL",
    "NEXTAUTH_SECRET",
    "NEXTAUTH_URL",
    "OPENAI_API_KEY",
  ];
  const optionalEnvVars = [
    "ADMIN_SECRET",
    "RESEND_API_KEY",
    "ELEVENLABS_API_KEY",
    "GFW_API_KEY",
    "CRON_SECRET",
    "TOKEN_ENCRYPTION_KEY",
    "SENTRY_AUTH_TOKEN",
    "VERCEL_ACCESS_TOKEN",
  ];

  const vars = [
    ...requiredEnvVars.map(name => ({ name, status: process.env[name] ? "set" : "missing", required: true })),
    ...optionalEnvVars.map(name => ({ name, status: process.env[name] ? "set" : "missing", required: false })),
  ];

  const missingRequired = vars.filter(e => e.required && e.status === "missing");
  checks.push({
    name: "Environment Variables",
    status: missingRequired.length === 0 ? "pass" : "warn",
    details: { vars, missingRequired: missingRequired.length },
    lastChecked: new Date().toISOString(),
  });

  // ============================================
  // 4. BUILD ARTIFACTS
  // ============================================
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require("fs") as typeof import("fs");
    const hasBuild = fs.existsSync(".next");
    const hasManifest = fs.existsSync(".next/build-manifest.json");
    checks.push({
      name: "Build Artifacts",
      status: hasBuild ? "pass" : "warn",
      details: { nextDirPresent: hasBuild, manifestPresent: hasManifest },
      lastChecked: new Date().toISOString(),
    });
  } catch {
    checks.push({
      name: "Build Artifacts",
      status: "warn",
      details: { note: "Cannot check build artifacts on this platform" },
      lastChecked: new Date().toISOString(),
    });
  }

  // ============================================
  // 5. SYSTEM RESOURCES
  // ============================================
  const mem = process.memoryUsage();
  const heapPct = mem.heapUsed / mem.heapTotal;
  checks.push({
    name: "System Resources",
    status: heapPct < 0.9 ? "pass" : "warn",
    details: {
      heapUsedMB: Math.round(mem.heapUsed / 1024 / 1024),
      heapTotalMB: Math.round(mem.heapTotal / 1024 / 1024),
      heapPct: Math.round(heapPct * 100),
      rssMB: Math.round(mem.rss / 1024 / 1024),
      uptimeHours: Math.round(process.uptime() / 3600),
      nodeVersion: process.version,
      platform: process.platform,
    },
    lastChecked: new Date().toISOString(),
  });

  // ============================================
  // 6. SUPER ADMIN ACCOUNTS
  // ============================================
  try {
    const superAdmins = await prisma.user.findMany({
      where: { role: "SUPER_ADMIN" },
      select: { email: true, name: true },
    });
    checks.push({
      name: "Super Admin Accounts",
      status: superAdmins.length >= 3 ? "pass" : "warn",
      details: { count: superAdmins.length, accounts: superAdmins },
      lastChecked: new Date().toISOString(),
    });
  } catch (error) {
    checks.push({
      name: "Super Admin Accounts",
      status: "fail",
      details: { error: String(error) },
      lastChecked: new Date().toISOString(),
    });
  }

  // ============================================
  // 7. ESCROW CRON READINESS
  // ============================================
  checks.push({
    name: "Escrow Cron (auto-release)",
    status: process.env.CRON_SECRET ? "pass" : "warn",
    details: {
      cronSecret: process.env.CRON_SECRET ? "set" : "missing",
      cronEndpoint: "/api/cron/release-escrow",
      schedule: "0 6 * * * (daily 06:00 UTC)",
    },
    lastChecked: new Date().toISOString(),
  });

  // ============================================
  // Calculate Overall Health Score
  // ============================================
  const totalChecks = checks.length;
  const passedChecks = checks.filter(c => c.status === "pass").length;
  const warnChecks = checks.filter(c => c.status === "warn").length;
  const failedChecks = checks.filter(c => c.status === "fail").length;
  const healthScore = Math.round((passedChecks / totalChecks) * 100);
  const overallStatus = healthScore >= 90 ? "HEALTHY" : healthScore >= 70 ? "WARNING" : "CRITICAL";
  const recommendations = generateRecommendations(checks);

  let billing = null;
  const billingAccessGranted = await canViewBilling(req);

  if (billingAccessGranted) {
    billing = await getBillingSnapshot();

    if (billing.alerts.critical.length > 0) {
      recommendations.push(
        `Billing critical: ${billing.alerts.critical
          .map((alert) => `${alert.service} at ${alert.percentage.toFixed(1)}%`)
          .join(", ")}`
      );
    }

    if (billing.alerts.degraded.length > 0) {
      recommendations.push(
        `Billing watchlist: ${billing.alerts.degraded
          .map((alert) => `${alert.service} at ${alert.percentage.toFixed(1)}%`)
          .join(", ")}`
      );
    }
  } else if (billingRequested) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    healthScore,
    overallStatus,
    summary: {
      totalChecks,
      passed: passedChecks,
      warnings: warnChecks,
      failed: failedChecks,
      diagnosticTimeMs: Date.now() - startTime,
    },
    checks,
    billing,
    access: {
      billing: billingAccessGranted,
    },
    recommendations,
  });
}
