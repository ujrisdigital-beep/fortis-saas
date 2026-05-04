// app/api/security/reverse-engineering-attempt/route.ts
// Logs reverse engineering / devtools-open attempts from CopyrightProtection component
import { NextRequest, NextResponse } from "next/server";

interface Attempt {
  type: string;
  timestamp: string;
  userAgent: string;
  url?: string;
  ip: string;
  receivedAt: string;
}

// In-memory log (up to 500 entries); persists for lifetime of serverless instance
const attempts: Attempt[] = [];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const attempt: Attempt = {
      type: body.type ?? "unknown",
      timestamp: body.timestamp ?? new Date().toISOString(),
      userAgent: req.headers.get("user-agent") ?? "unknown",
      url: body.url,
      ip:
        req.headers.get("x-forwarded-for") ??
        req.headers.get("x-real-ip") ??
        "unknown",
      receivedAt: new Date().toISOString(),
    };

    if (attempts.length >= 500) attempts.shift();
    attempts.push(attempt);

    console.warn(
      `[SECURITY] Reverse engineering attempt: ${attempt.type} from ${attempt.ip} at ${attempt.timestamp}`
    );

    return NextResponse.json({ logged: true });
  } catch {
    return NextResponse.json({ logged: false }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  // Only accessible server-side or with admin secret
  const secret = req.headers.get("x-admin-secret");
  if (process.env.ADMIN_SECRET && secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ attempts: attempts.slice(-100), total: attempts.length });
}
