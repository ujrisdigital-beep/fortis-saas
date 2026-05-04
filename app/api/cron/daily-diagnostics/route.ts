// app/api/cron/daily-diagnostics/route.ts
// Daily billing and diagnostics summary.
import { NextResponse } from "next/server";
import { checkAndNotifyBilling, sendDailyBillingSummaryEmail } from "@/lib/auto-billing";
import { runDiagnostics } from "@/lib/diagnostics/ai-remediation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  const expectedSecret = process.env.CRON_SECRET;

  if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
    const host = req.headers.get("host") ?? "";
    if (!host.includes("localhost")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const [billing, diagnostics] = await Promise.all([
      checkAndNotifyBilling("Daily diagnostics cron"),
      runDiagnostics(),
    ]);

    const summaryEmailSent = await sendDailyBillingSummaryEmail(billing, {
      healthScore: diagnostics.healthScore,
      summary: diagnostics.summary,
    });

    return NextResponse.json({
      ok: true,
      ranAt: new Date().toISOString(),
      billingStatus: billing.overallStatus,
      totalEstimatedChargeUsd: billing.totalEstimatedChargeUsd,
      billingAlerts: {
        critical: billing.alerts.critical.length,
        degraded: billing.alerts.degraded.length,
      },
      systemHealthScore: diagnostics.healthScore,
      systemSummary: diagnostics.summary,
      summaryEmailSent,
    });
  } catch (error) {
    console.error("[DAILY-DIAGNOSTICS-CRON-ERROR]", error);
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
