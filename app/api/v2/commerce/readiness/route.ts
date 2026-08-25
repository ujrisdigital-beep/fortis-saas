import { NextResponse } from "next/server";
import { commerceGates, publicCommerceReady, sandboxUserTestingReady } from "@/lib/commerce/readiness";

export async function GET() {
  const gates = commerceGates();
  return NextResponse.json({
    publicCommerceReady: publicCommerceReady(),
    sandboxUserTestingReady: sandboxUserTestingReady(),
    publicInventory: [],
    rail: "transfer_until_psp",
    gates,
  });
}
