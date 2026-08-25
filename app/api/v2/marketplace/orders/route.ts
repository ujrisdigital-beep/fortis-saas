import { NextResponse } from "next/server";
import { requireApiAccess } from "@/lib/core/api-guard";
import { canUseFeature } from "@/lib/core/entitlements";
import { listGrants } from "@/lib/entitlements/store";

export async function GET() {
  const access = await requireApiAccess("marketplace", "read");
  if (!access.ok) return access.response;
  const ready = canUseFeature(
    listGrants(access.session.organisationId),
    access.session.organisationId,
    "marketplace.order",
  );
  return NextResponse.json({
    orders: [],
    fulfilmentUnlocked: ready,
    notice: ready
      ? "Transfer evidence accepted provisionally. Fulfilment can proceed."
      : "Pay by transfer at /pay/transfer then submit evidence before fulfilment.",
  });
}
