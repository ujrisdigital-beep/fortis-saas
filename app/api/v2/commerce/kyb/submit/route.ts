import { NextResponse } from "next/server";
import { requireApiAccess } from "@/lib/core/api-guard";
import { submitMerchantKyb } from "@/lib/partner/kyb-store";

export async function POST() {
  const access = await requireApiAccess("marketplace", "write");
  if (!access.ok) return access.response;
  try {
    const row = submitMerchantKyb(access.session.organisationId);
    return NextResponse.json({
      kyb: row,
      canList: false,
      notice: "Submitted for human review. Listing stays closed until APPROVED and a licensed PSP exists.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "invalid" },
      { status: 400 },
    );
  }
}
