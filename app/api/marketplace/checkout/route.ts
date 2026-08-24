import { NextResponse } from "next/server";
import { requireApiAccess } from "@/lib/core/api-guard";

export async function POST() {
  const access = await requireApiAccess("marketplace", "write");
  if (!access.ok) return access.response;
  return NextResponse.json(
    {
      error: "marketplace_checkout_closed",
      code: "MODULE_NOT_PRODUCTION_READY",
      escrow: false,
      booked: false,
    },
    { status: 503 },
  );
}
