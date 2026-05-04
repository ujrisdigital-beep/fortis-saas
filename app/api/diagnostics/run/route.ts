// app/api/diagnostics/run/route.ts
// Vercel Cron endpoint — runs every 5 minutes
// AI heals what it can. Escalates only what it cannot.
import { NextResponse } from "next/server";
import { runDiagnostics, logDiagnosticRun } from "@/lib/diagnostics/ai-remediation";
import { escalateToHuman, storeEscalation } from "@/lib/notifications/alert";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function GET(req: Request) {
  // Verify cron secret (Vercel sets this header automatically for cron jobs)
  const authHeader = req.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    // Also allow unauthenticated from localhost for development
    const host = req.headers.get("host") ?? "";
    if (!host.includes("localhost")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const { results, healthScore, escalations, summary } = await runDiagnostics();

    // Log to Vercel logs
    await logDiagnosticRun(results, healthScore);

    // Escalate issues AI couldn't resolve
    for (const esc of escalations) {
      if (esc.escalate && esc.escalationMessage) {
        const payload = {
          issue: esc.name,
          detail: esc.detail,
          attemptedFix: esc.remediationAction,
          instructions: esc.escalationMessage,
          priority: healthScore < 50 ? "critical" as const : healthScore < 75 ? "high" as const : "medium" as const,
          source: "Automated Diagnostic (5-min cron)",
        };
        storeEscalation(payload);
        await escalateToHuman(payload);
      }
    }

    return NextResponse.json({
      ok: true,
      healthScore,
      summary,
      escalations: escalations.length,
      results: results.map((r) => ({
        name: r.name,
        healthy: r.healthy,
        latencyMs: r.latencyMs,
        detail: r.detail,
        remediated: r.remediated ?? false,
        escalated: r.escalate ?? false,
      })),
      ts: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[DIAGNOSTICS-CRON-CRASH]", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

// Also allow POST for manual trigger from admin panel
export async function POST(req: Request) {
  return GET(req);
}
