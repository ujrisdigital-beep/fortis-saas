import { NextResponse } from "next/server";
import { FORTIS_CATALOGUE, resolveCheckoutPrice, PriceResolutionError } from "@/lib/core/catalogue";

export async function GET(_request: Request, context: { params: { priceId: string } }) {
  try {
    const price = resolveCheckoutPrice(FORTIS_CATALOGUE, context.params.priceId);
    return NextResponse.json({
      priceId: price.id,
      amountMinor: price.amountMinor,
      currency: price.currency,
      interval: price.interval,
    });
  } catch (error) {
    if (error instanceof PriceResolutionError) {
      return NextResponse.json({ error: error.message, code: "PRICE_UNRESOLVED" }, { status: 404 });
    }
    return NextResponse.json({ error: "internal", code: "INTERNAL" }, { status: 500 });
  }
}
