import { NextResponse } from "next/server";
import { requireApiAccess } from "@/lib/core/api-guard";
import { quoteByPriceId } from "@/lib/monetisation/quote";
import { PriceResolutionError } from "@/lib/core/catalogue";

export async function POST(request: Request) {
  const access = await requireApiAccess("billing", "read");
  if (!access.ok) return access.response;
  const body = (await request.json().catch(() => null)) as { priceId?: string } | null;
  if (!body?.priceId) {
    return NextResponse.json({ error: "priceId required", code: "INVALID_INPUT" }, { status: 400 });
  }
  try {
    return NextResponse.json(quoteByPriceId(body.priceId));
  } catch (error) {
    if (error instanceof PriceResolutionError) {
      return NextResponse.json({ error: error.message, code: "PRICE_UNRESOLVED" }, { status: 404 });
    }
    return NextResponse.json({ error: "internal", code: "INTERNAL" }, { status: 500 });
  }
}
