import type { CreateIntentInput, PaymentProviderAdapter, ProviderIntent, ProviderWebhookEnvelope } from "./types";
import { verifyWebhookSignature } from "./webhooks";

export class SandboxPaymentAdapter implements PaymentProviderAdapter {
  readonly name = "fortis_sandbox";
  readonly mode = "sandbox" as const;
  private intents = new Map<string, ProviderIntent>();

  async createIntent(input: CreateIntentInput): Promise<ProviderIntent> {
    const existing = this.intents.get(input.idempotencyKey);
    if (existing) return existing;
    const intent: ProviderIntent = {
      provider: this.name,
      providerRef: `sbx_${input.idempotencyKey}`,
      status: "created",
      amountMinor: input.amountMinor,
      currency: input.currency,
    };
    this.intents.set(input.idempotencyKey, intent);
    return intent;
  }

  async refund(providerRef: string, amountMinor: number): Promise<{ refundRef: string; status: string }> {
    return { refundRef: `sbx_rf_${providerRef}_${amountMinor}`, status: "pending" };
  }

  parseWebhook(envelope: ProviderWebhookEnvelope, secret: string) {
    const verified = verifyWebhookSignature(envelope, secret);
    if (!verified.ok) return { ok: false as const, reason: verified.reason };
    return { ok: true as const, eventType: envelope.eventType };
  }

  captureLocal(idempotencyKey: string): ProviderIntent {
    const intent = this.intents.get(idempotencyKey);
    if (!intent) throw new Error("unknown_intent");
    intent.status = "captured";
    return intent;
  }
}
