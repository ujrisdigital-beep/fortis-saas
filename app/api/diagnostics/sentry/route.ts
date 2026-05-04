// app/api/diagnostics/sentry/route.ts
// Optional Sentry error tracking metrics for admin dashboard
import { NextResponse } from "next/server";

export async function GET() {
  const sentryToken = process.env.SENTRY_AUTH_TOKEN;
  const sentryOrg = process.env.SENTRY_ORG ?? "fortis-os";
  const sentryProject = process.env.SENTRY_PROJECT ?? "fortis-saas";

  if (!sentryToken) {
    return NextResponse.json({
      available: false,
      message: "Sentry not configured. Add SENTRY_AUTH_TOKEN, SENTRY_ORG, and SENTRY_PROJECT to .env to enable.",
    });
  }

  try {
    const response = await fetch(
      `https://sentry.io/api/0/projects/${sentryOrg}/${sentryProject}/stats/?resolution=1d&stat=received`,
      {
        headers: { Authorization: `Bearer ${sentryToken}` },
        signal: AbortSignal.timeout(8000),
      }
    );
    if (!response.ok) {
      return NextResponse.json({
        available: false,
        error: `Sentry API returned ${response.status}`,
        hint: "Check SENTRY_ORG and SENTRY_PROJECT values.",
      });
    }
    const stats = await response.json();
    return NextResponse.json({ available: true, org: sentryOrg, project: sentryProject, stats });
  } catch (error) {
    return NextResponse.json({ available: false, error: String(error) });
  }
}
