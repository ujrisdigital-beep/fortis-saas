import { NextResponse } from "next/server";
import { requireApiAccess } from "@/lib/core/api-guard";
import { quoteByPriceId } from "@/lib/monetisation/quote";
import { SandboxPaymentAdapter } from "@/lib/core/payments/sandbox-adapter";
import { publicCommerceReady } from "@/lib/commerce/readiness";
import { PriceResolutionError } from "@/lib/core/catalogue";

const sandbox = new SandboxPaymentAdapter();

export async function POST(request: Request) {
  const access = await requireApiAccess("billing", "payment.intent");
  if (!access.ok) return access.response;
  if (publicCommerceReady()) {
    return NextResponse.json(
      { error: "use_licensed_psp_adapter", code: "LIVE_PATH_NOT_WIRED" },
      { status: 409 },
    );
  }
  const body = (await request.json().catch(() => ({}))) as { priceId?: string };
  try {
    const quote = quoteByPriceId(body.priceId ?? "price_grow_diagnostic_gmd_v1");
    const intent = await sandbox.createIntent({
      organisationId: access.session.organisationId,
      priceId: quote.priceId,
      amountMinor: quote.amountMinor,
      currency: quote.currency,
      idempotencyKey: `${access.session.organisationId}:${quote.priceId}:${Date.now()}`,
    });
    return NextResponse.json({
      intent,
      liveCapture: false,
      notice: "Sandbox intent only. Not a card charge. Transfer rail remains the public pay path.",
    });
  } catch (error) {
    if (error instanceof PriceResolutionError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
}
