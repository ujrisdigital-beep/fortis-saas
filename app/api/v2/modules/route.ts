import { NextResponse } from "next/server";
import { MODULE_LAUNCH } from "@/lib/core/modules";
import { isFlagEnabled } from "@/lib/core/feature-flags";

export async function GET() {
  return NextResponse.json({
    liveCardCapture: isFlagEnabled("module.core.payments.live"),
    partnerCommerce: isFlagEnabled("module.partner.commerce"),
    discoverTickets: isFlagEnabled("module.discover.tickets"),
    modules: MODULE_LAUNCH,
  });
}
