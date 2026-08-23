export type ProviderMode = "sandbox";

export interface CreateIntentInput {
  organisationId: string;
  priceId: string;
  amountMinor: number;
  currency: string;
  idempotencyKey: string;
}

export interface ProviderIntent {
  provider: string;
  providerRef: string;
  status: "created" | "authorised" | "captured" | "failed";
  amountMinor: number;
  currency: string;
}

export interface ProviderWebhookEnvelope {
  provider: string;
  externalId: string;
  eventType: string;
  payload: string;
  signature: string;
  timestamp: number;
}

export interface PaymentProviderAdapter {
  readonly name: string;
  readonly mode: ProviderMode;
  createIntent(input: CreateIntentInput): Promise<ProviderIntent>;
  refund(providerRef: string, amountMinor: number): Promise<{ refundRef: string; status: string }>;
  parseWebhook(envelope: ProviderWebhookEnvelope, secret: string): { ok: true; eventType: string } | { ok: false; reason: string };
}
