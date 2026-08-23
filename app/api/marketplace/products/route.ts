import { NextResponse } from "next/server";
import { requireApiAccess } from "@/lib/core/api-guard";

/** Demo inventory is not published. Empty until a KYB merchant persists a reviewed SKU. */
export async function GET() {
  return NextResponse.json({
    products: [],
    total: 0,
    live: false,
    notice: "No authoritative merchant catalogue is published. Demo SKUs are not listed.",
  });
}

export async function POST() {
  const access = await requireApiAccess("marketplace", "write");
  if (!access.ok) return access.response;
  return NextResponse.json(
    {
      error: "kyb_and_persistent_catalogue_required",
      code: "MODULE_NOT_PRODUCTION_READY",
    },
    { status: 503 },
  );
}
