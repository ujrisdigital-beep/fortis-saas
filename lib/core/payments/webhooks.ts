import { createHmac, timingSafeEqual } from "node:crypto";
import type { ProviderWebhookEnvelope } from "./types";

const MAX_SKEW_MS = 5 * 60 * 1000;

export function signWebhookPayload(payload: string, secret: string, timestamp: number): string {
  return createHmac("sha256", secret).update(`${timestamp}.${payload}`).digest("hex");
}

export function verifyWebhookSignature(
  envelope: ProviderWebhookEnvelope,
  secret: string,
  now = Date.now(),
): { ok: true } | { ok: false; reason: string } {
  if (Math.abs(now - envelope.timestamp) > MAX_SKEW_MS) {
    return { ok: false, reason: "timestamp_skew" };
  }
  const expected = signWebhookPayload(envelope.payload, secret, envelope.timestamp);
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(envelope.signature, "hex");
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { ok: false, reason: "bad_signature" };
  }
  return { ok: true };
}

export interface EventInboxRecord {
  provider: string;
  externalId: string;
  eventType: string;
  status: "RECEIVED" | "REJECTED" | "PROCESSED";
}

export function ingestWebhook(
  inbox: EventInboxRecord[],
  envelope: ProviderWebhookEnvelope,
  secret: string,
): { accepted: boolean; duplicate: boolean; reason?: string; record: EventInboxRecord } {
  const existing = inbox.find((e) => e.provider === envelope.provider && e.externalId === envelope.externalId);
  if (existing) {
    return { accepted: existing.status !== "REJECTED", duplicate: true, record: existing };
  }
  const verified = verifyWebhookSignature(envelope, secret);
  if (!verified.ok) {
    const record: EventInboxRecord = {
      provider: envelope.provider,
      externalId: envelope.externalId,
      eventType: envelope.eventType,
      status: "REJECTED",
    };
    inbox.push(record);
    return { accepted: false, duplicate: false, reason: verified.reason, record };
  }
  const record: EventInboxRecord = {
    provider: envelope.provider,
    externalId: envelope.externalId,
    eventType: envelope.eventType,
    status: "RECEIVED",
  };
  inbox.push(record);
  return { accepted: true, duplicate: false, record };
}

export function markProcessed(inbox: EventInboxRecord[], provider: string, externalId: string): void {
  const record = inbox.find((e) => e.provider === provider && e.externalId === externalId);
  if (record && record.status === "RECEIVED") {
    record.status = "PROCESSED";
  }
}
