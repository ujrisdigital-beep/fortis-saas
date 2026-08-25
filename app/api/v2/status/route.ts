import { NextResponse } from "next/server";
import { DEFAULT_FLAGS } from "@/lib/core/feature-flags";

export async function GET() {
  const dbConfigured = Boolean(process.env.DATABASE_URL);
  const authConfigured = Boolean(process.env.NEXTAUTH_SECRET);
  const livePayments = false;

  const dependencies = {
    database: dbConfigured ? "configured" : "missing",
    auth: authConfigured ? "configured" : "missing",
    paymentLive: livePayments ? "open" : "blocked_pending_signoff",
    gemini: process.env.GEMINI_API_KEY ? "optional_byok" : "unused_deterministic_fallback",
  };

  const healthy = dbConfigured && authConfigured;
  return NextResponse.json({
    status: healthy ? "ok" : "degraded",
    service: "fortis-core",
    timestamp: new Date().toISOString(),
    dependencies,
    flags: DEFAULT_FLAGS,
    slos: {
      apiAvailabilityTarget: 0.995,
      growP95Ms: 2500,
      webhookLagMs: 30000,
    },
  });
}
