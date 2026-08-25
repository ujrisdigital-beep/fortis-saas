import { NextResponse } from "next/server";
import { ingestWebhook, type EventInboxRecord } from "@/lib/core/payments/webhooks";
import { postPaymentCapture, type PostedTransaction } from "@/lib/core/ledger";

const inbox: EventInboxRecord[] = [];
const book: PostedTransaction[] = [];

export async function POST(request: Request) {
  const secret = process.env.FORTIS_SANDBOX_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "webhook_unconfigured", code: "UNCONFIGURED" }, { status: 503 });
  }

  const timestamp = Number(request.headers.get("x-fortis-timestamp") ?? "");
  const signature = request.headers.get("x-fortis-signature") ?? "";
  const payload = await request.text();
  let parsed: { provider?: string; externalId?: string; eventType?: string; organisationId?: string; amountMinor?: number; currency?: string };
  try {
    parsed = JSON.parse(payload) as typeof parsed;
  } catch {
    return NextResponse.json({ error: "invalid_json", code: "INVALID_INPUT" }, { status: 400 });
  }

  const result = ingestWebhook(
    inbox,
    {
      provider: parsed.provider ?? "fortis_sandbox",
      externalId: parsed.externalId ?? "",
      eventType: parsed.eventType ?? "",
      payload,
      signature,
      timestamp,
    },
    secret,
  );

  if (!result.accepted) {
    return NextResponse.json({ error: result.reason ?? "rejected", code: "REJECTED", duplicate: result.duplicate }, { status: 400 });
  }
  if (result.duplicate) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  if (parsed.eventType === "payment.captured" && parsed.organisationId && parsed.amountMinor && parsed.currency) {
    postPaymentCapture(book, {
      organisationId: parsed.organisationId,
      amountMinor: parsed.amountMinor,
      currency: parsed.currency,
      idempotencyKey: `ledger:${parsed.externalId}`,
    });
  }

  return NextResponse.json({ ok: true, duplicate: false });
}
