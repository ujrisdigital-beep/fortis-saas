import { NextResponse } from "next/server";
import { FORTIS_CATALOGUE } from "@/lib/core/catalogue";
import { isFlagEnabled } from "@/lib/core/feature-flags";

export async function GET() {
  return NextResponse.json({
    prices: FORTIS_CATALOGUE.filter((p) => p.status === "ACTIVE"),
    liveCapture: isFlagEnabled("module.core.payments.live"),
    rail: "transfer",
  });
}
