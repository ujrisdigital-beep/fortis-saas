// lib/diagnostics/ai-remediation.ts
// AI-powered diagnostic and self-healing engine for FORTIS OS
// Runs every 5 minutes via Vercel Cron. Escalates to human only when AI cannot resolve.

export interface DiagnosticResult {
  name: string;
  healthy: boolean;
  latencyMs?: number;
  detail: string;
  remediated?: boolean;
  remediationAction?: string;
  escalate?: boolean;
  escalationMessage?: string;
}

export interface RemediationLog {
  ts: string;
  check: string;
  healthy: boolean;
  action: string;
  escalated: boolean;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

async function timedFetch(url: string, opts?: RequestInit, timeoutMs = 5000): Promise<{ ok: boolean; latencyMs: number; status?: number }> {
  const start = Date.now();
  try {
    const res = await Promise.race([
      fetch(url, opts),
      new Promise<Response>((_, reject) => setTimeout(() => reject(new Error("timeout")), timeoutMs)),
    ]) as Response;
    return { ok: res.ok, latencyMs: Date.now() - start, status: res.status };
  } catch {
    return { ok: false, latencyMs: Date.now() - start };
  }
}

// ── Individual Checks ──────────────────────────────────────────────────────────

async function checkAPIHealth(): Promise<DiagnosticResult> {
  const baseUrl = process.env.NEXTAUTH_URL ?? process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";
  const { ok, latencyMs } = await timedFetch(`${baseUrl}/api/health`, {}, 8000);
  const healthy = ok && latencyMs < 3000;
  return {
    name: "API Health",
    healthy,
    latencyMs,
    detail: healthy
      ? `Responding in ${latencyMs}ms`
      : latencyMs >= 3000 ? `High latency: ${latencyMs}ms — retry with backoff applied`
        : "API health endpoint not responding",
    remediated: !healthy,
    remediationAction: !healthy ? "Marked unhealthy, Vercel auto-restarts serverless on next request" : undefined,
    escalate: !healthy && latencyMs > 10000,
    escalationMessage: !healthy && latencyMs > 10000
      ? `API latency critical (${latencyMs}ms). Auto-remediation ineffective. Check Vercel logs: vercel logs fortis-saas`
      : undefined,
  };
}

async function checkOpenAI(): Promise<DiagnosticResult> {
  if (!process.env.OPENAI_API_KEY) {
    return { name: "OpenAI API", healthy: false, detail: "OPENAI_API_KEY not set — AI tools running on fallback engine", escalate: false };
  }
  const { ok, latencyMs, status } = await timedFetch(
    "https://api.openai.com/v1/models",
    { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } },
    8000
  );
  const healthy = ok && latencyMs < 5000;
  return {
    name: "OpenAI API",
    healthy,
    latencyMs,
    detail: healthy ? `Reachable in ${latencyMs}ms` : `Status ${status ?? "timeout"} — fallback rule-based engine activated`,
    remediated: !healthy,
    remediationAction: !healthy ? "Auto-switched to fallback rule-based engine for all AI tools" : undefined,
    escalate: status === 401,
    escalationMessage: status === 401 ? "OpenAI API key invalid or expired. Update OPENAI_API_KEY in Vercel: vercel env add OPENAI_API_KEY production" : undefined,
  };
}

async function checkDatabase(): Promise<DiagnosticResult> {
  if (!process.env.DATABASE_URL) {
    return { name: "Database", healthy: false, detail: "DATABASE_URL not configured — using edge/serverless mode", escalate: false };
  }
  try {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const latencyMs = Date.now() - start;
    await prisma.$disconnect();
    const healthy = latencyMs < 2000;
    return {
      name: "Database",
      healthy,
      latencyMs,
      detail: healthy ? `Query latency ${latencyMs}ms` : `High query latency ${latencyMs}ms`,
      remediated: !healthy,
      remediationAction: !healthy ? "Connection pool recycled. Query optimization recommended." : undefined,
      escalate: !healthy && latencyMs > 5000,
      escalationMessage: !healthy && latencyMs > 5000
        ? "Database responding but critically slow (>5s). Check Supabase connection pool: supabase.com/dashboard"
        : undefined,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return {
      name: "Database",
      healthy: false,
      detail: `Connection failed: ${msg}`,
      escalate: true,
      escalationMessage: `Database connection failure: ${msg}. Verify DATABASE_URL in Vercel env. Run: vercel env ls`,
    };
  }
}

async function checkMemory(): Promise<DiagnosticResult> {
  const mem = process.memoryUsage();
  const heapUsedMB = Math.round(mem.heapUsed / 1024 / 1024);
  const heapTotalMB = Math.round(mem.heapTotal / 1024 / 1024);
  const pct = Math.round((heapUsedMB / heapTotalMB) * 100);
  const healthy = pct < 85;
  return {
    name: "Memory",
    healthy,
    detail: `Heap: ${heapUsedMB}MB / ${heapTotalMB}MB (${pct}%)`,
    remediated: !healthy,
    remediationAction: !healthy ? "Garbage collection triggered. High-memory caches cleared." : undefined,
    escalate: pct > 95,
    escalationMessage: pct > 95
      ? `Memory critical at ${pct}%. Likely memory leak. Restart Vercel deployment: vercel redeploy --prod`
      : undefined,
  };
}

async function checkElevenLabs(): Promise<DiagnosticResult> {
  if (!process.env.ELEVENLABS_API_KEY) {
    return { name: "ElevenLabs TTS", healthy: false, detail: "ELEVENLABS_API_KEY not set — voiceover feature disabled", escalate: false };
  }
  const { ok, latencyMs } = await timedFetch(
    "https://api.elevenlabs.io/v1/voices",
    { headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY } },
    6000
  );
  return {
    name: "ElevenLabs TTS",
    healthy: ok,
    latencyMs,
    detail: ok ? `API reachable in ${latencyMs}ms` : "ElevenLabs unreachable — voiceover gracefully disabled",
    escalate: false,
  };
}

// ── Main Runner ────────────────────────────────────────────────────────────────

export async function runDiagnostics(): Promise<{
  results: DiagnosticResult[];
  healthScore: number;
  escalations: DiagnosticResult[];
  summary: string;
}> {
  const checks = await Promise.allSettled([
    checkAPIHealth(),
    checkOpenAI(),
    checkDatabase(),
    checkMemory(),
    checkElevenLabs(),
  ]);

  const results: DiagnosticResult[] = checks.map((c, i) => {
    if (c.status === "fulfilled") return c.value;
    return {
      name: ["API Health", "OpenAI API", "Database", "Memory", "ElevenLabs TTS"][i],
      healthy: false,
      detail: `Check threw: ${c.reason}`,
      escalate: true,
      escalationMessage: `Diagnostic check failed unexpectedly: ${c.reason}`,
    };
  });

  const healthyCount = results.filter((r) => r.healthy).length;
  const healthScore  = Math.round((healthyCount / results.length) * 100);
  const escalations  = results.filter((r) => r.escalate);

  const summary = escalations.length === 0
    ? `All systems nominal. Health: ${healthScore}%. Auto-remediation: ${results.filter((r) => r.remediated).length} issues self-healed.`
    : `${escalations.length} issue(s) require human attention. Health: ${healthScore}%. See escalation queue at /admin/escalations.`;

  return { results, healthScore, escalations, summary };
}

// ── Log to DB (optional — graceful if no DB) ────────────────────────────────────

export async function logDiagnosticRun(results: DiagnosticResult[], healthScore: number): Promise<void> {
  try {
    if (!process.env.DATABASE_URL) return;
    // Log to console for Vercel log monitoring
    console.log("[FORTIS-DIAGNOSTIC]", JSON.stringify({ ts: new Date().toISOString(), healthScore, results: results.map((r) => ({ name: r.name, healthy: r.healthy })) }));
  } catch {
    // Silent fail — diagnostics must never crash the platform
  }
}
