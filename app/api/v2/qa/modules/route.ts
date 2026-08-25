import { NextResponse } from "next/server";
import { APPLET_SCORECARDS, monetisationIntegrationSurface } from "@/lib/qa/module-readiness";

export async function GET() {
  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    applets: APPLET_SCORECARDS,
    monetisation: monetisationIntegrationSurface(),
  });
}
