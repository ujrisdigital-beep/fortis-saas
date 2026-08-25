import { NextResponse } from "next/server";
import { requireApiAccess } from "@/lib/core/api-guard";
import { createInstruction, platformBeneficiary } from "@/lib/payments/transfer";
import { quoteByPriceId } from "@/lib/monetisation/quote";
import { rideStore } from "@/lib/rides/registry";
import { PriceResolutionError } from "@/lib/core/catalogue";

export async function POST(request: Request) {
  const access = await requireApiAccess("billing", "read");
  if (!access.ok) return access.response;
  const body = (await request.json().catch(() => ({}))) as {
    priceId?: string;
    module?: "rides" | "grow" | "academy" | "marketplace" | "core" | "discover" | "govern" | "partner";
    serviceId?: string;
  };
  try {
    const quote = body.priceId
      ? quoteByPriceId(body.priceId)
      : null;
    const payee = platformBeneficiary();
    const instruction = createInstruction({
      module: body.module ?? "core",
      serviceId: body.serviceId ?? body.priceId ?? "unspecified",
      organisationHint: access.session.organisationId,
      amountMinor: quote?.amountMinor ?? 0,
      currency: quote?.currency ?? "GMD",
      ...payee,
    });
    if (!quote) {
      return NextResponse.json({ error: "priceId required for non-ride transfers", code: "INVALID_INPUT" }, { status: 400 });
    }
    rideStore.transfers.set(instruction.reference, instruction);
    return NextResponse.json({
      instruction,
      liveCardCapture: false,
      awaiting: "SBN-COMCACHE SLA",
    });
  } catch (error) {
    if (error instanceof PriceResolutionError) {
      return NextResponse.json({ error: error.message, code: "PRICE_UNRESOLVED" }, { status: 404 });
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : "invalid" }, { status: 400 });
  }
}
