import { NextResponse } from "next/server";

const startTime = Date.now();

export async function GET() {
  const uptime = Math.floor((Date.now() - startTime) / 1000);
  const mem = process.memoryUsage();

  const checks = {
    openai: !!process.env.OPENAI_API_KEY,
    ujuPrompt: !!process.env.UJU_PROMPT,
    ikengaPrompt: !!process.env.IKENGA_PROMPT,
    ujrisPrompt: !!process.env.UJRIS_PROMPT,
    bankVerification: !!process.env.BANK_VERIFICATION_METHOD,
  };

  const allConfigured = Object.values(checks).every(Boolean);

  return NextResponse.json({
    status: "ok",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    uptime: {
      seconds: uptime,
      formatted: formatUptime(uptime),
    },
    memory: {
      heapUsedMB: Math.round(mem.heapUsed / 1024 / 1024),
      heapTotalMB: Math.round(mem.heapTotal / 1024 / 1024),
      rssMB: Math.round(mem.rss / 1024 / 1024),
    },
    env: {
      node: process.version,
      platform: process.platform,
    },
    configuration: checks,
    fullyConfigured: allConfigured,
    coreStatus: "/api/v2/status",
  });
}

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const parts: string[] = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);
  return parts.join(" ");
}
