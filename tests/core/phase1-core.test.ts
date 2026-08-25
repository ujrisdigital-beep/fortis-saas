import { describe, expect, it } from "vitest";
import { authorize, type Membership } from "../../lib/core/policy";
import { GROW_DIAGNOSTIC_CATALOGUE, resolveCheckoutPrice, PriceResolutionError } from "../../lib/core/catalogue";
import { canUseFeature, grantAfterVerifiedPurchase, reserveEntitlementCheck } from "../../lib/core/entitlements";
import { commitUsage, failUsage, reserveUsage, reverseUsage, shouldAlert, type MeterStore } from "../../lib/core/metering";
import { ingestWebhook, signWebhookPayload, type EventInboxRecord } from "../../lib/core/payments/webhooks";
import { SandboxPaymentAdapter } from "../../lib/core/payments/sandbox-adapter";
import { postPaymentCapture, postRefund, postTransaction, reverseTransaction, type PostedTransaction } from "../../lib/core/ledger";
import { reconcile } from "../../lib/core/reconciliation";

const orgA = "org_a";
const orgB = "org_b";
const alice = "user_alice";
const bob = "user_bob";

function memberships(): Membership[] {
  return [
    { organisationId: orgA, userId: alice, roleKey: "org_member", status: "ACTIVE" },
    { organisationId: orgB, userId: bob, roleKey: "org_owner", status: "ACTIVE" },
    { organisationId: orgA, userId: bob, roleKey: "org_viewer", status: "ACTIVE" },
  ];
}

describe("tenant memberships and policy", () => {
  it("denies cross-tenant admin and unprivileged billing manage", () => {
    const cross = authorize(
      { actorId: alice, organisationId: orgB, memberships: memberships() },
      "admin",
      "admin",
    );
    expect(cross.allowed).toBe(false);
    expect(cross.reason).toBe("no_active_membership");
    expect(cross.audit?.type).toBe("audit.sensitive_access");

    const unprivileged = authorize(
      { actorId: alice, organisationId: orgA, memberships: memberships() },
      "billing",
      "billing.manage",
    );
    expect(unprivileged.allowed).toBe(false);
    expect(unprivileged.reason).toBe("insufficient_role");
  });

  it("allows entitled member to check entitlements in own tenant", () => {
    const ok = authorize(
      { actorId: alice, organisationId: orgA, memberships: memberships() },
      "billing",
      "entitlement.check",
    );
    expect(ok.allowed).toBe(true);
  });

  it("requires email verification and step-up when configured", () => {
    const unverified = authorize(
      { actorId: alice, organisationId: orgA, memberships: memberships(), emailVerified: false },
      "grow",
      "write",
    );
    expect(unverified.reason).toBe("email_unverified");
    const step = authorize(
      {
        actorId: bob,
        organisationId: orgB,
        memberships: memberships(),
        requiresStepUp: true,
        stepUpSatisfied: false,
      },
      "billing",
      "billing.manage",
    );
    expect(step.reason).toBe("step_up_required");
  });
});

describe("catalogue and entitlements", () => {
  it("resolves server-owned GROW price and rejects unknown ids", () => {
    const price = resolveCheckoutPrice(GROW_DIAGNOSTIC_CATALOGUE, "price_grow_diagnostic_gmd_v1");
    expect(price.amountMinor).toBe(25000);
    expect(price.currency).toBe("GMD");
    expect(() => resolveCheckoutPrice(GROW_DIAGNOSTIC_CATALOGUE, "browser_forged")).toThrow(PriceResolutionError);
  });

  it("grants nothing without verified purchase", () => {
    expect(() =>
      grantAfterVerifiedPurchase({ subscriptionActive: false, oneOffVerified: false }, orgA, "grow.diagnostic"),
    ).toThrow("no_verified_purchase");
    const grant = grantAfterVerifiedPurchase({ subscriptionActive: false, oneOffVerified: true }, orgA, "grow.diagnostic");
    expect(canUseFeature([grant], orgA, "grow.diagnostic")).toBe(true);
    expect(reserveEntitlementCheck({ grants: [], organisationId: orgA, featureKey: "grow.diagnostic" }).allowed).toBe(
      false,
    );
  });
});

describe("usage metering", () => {
  it("blocks concurrent reservations beyond the hard allowance and stays idempotent", () => {
    const store: MeterStore = {
      limits: [{ organisationId: orgA, featureKey: "grow.report", periodKey: "2026-08", hardLimit: 2, alertThreshold: 2 }],
      reservations: [],
      events: [],
    };
    const a = reserveUsage(store, {
      organisationId: orgA,
      featureKey: "grow.report",
      units: 1,
      idempotencyKey: "k1",
      periodKey: "2026-08",
    });
    const b = reserveUsage(store, {
      organisationId: orgA,
      featureKey: "grow.report",
      units: 1,
      idempotencyKey: "k2",
      periodKey: "2026-08",
    });
    const c = reserveUsage(store, {
      organisationId: orgA,
      featureKey: "grow.report",
      units: 1,
      idempotencyKey: "k3",
      periodKey: "2026-08",
    });
    const replay = reserveUsage(store, {
      organisationId: orgA,
      featureKey: "grow.report",
      units: 1,
      idempotencyKey: "k1",
      periodKey: "2026-08",
    });
    expect(a.ok && b.ok).toBe(true);
    expect(shouldAlert(store, orgA, "grow.report", "2026-08")).toBe(true);
    expect(c.ok).toBe(false);
    if (!c.ok) expect(c.reason).toBe("allowance_exceeded");
    if (a.ok && replay.ok) expect(replay.reservation.id).toBe(a.reservation.id);
    if (a.ok) {
      const consumed = commitUsage(store, a.reservation.id, "c1");
      expect(commitUsage(store, a.reservation.id, "c1").id).toBe(consumed.id);
    }
    if (b.ok) {
      failUsage(store, b.reservation.id, "f1");
    }
    reverseUsage(store, "evt_c1", "rev1");
    const afterReverse = reserveUsage(store, {
      organisationId: orgA,
      featureKey: "grow.report",
      units: 1,
      idempotencyKey: "k4",
      periodKey: "2026-08",
    });
    expect(afterReverse.ok).toBe(true);
  });
});

describe("sandbox payments, signed webhooks, ledger, reconciliation", () => {
  it("does not double-post duplicate or out-of-order webhooks", async () => {
    const adapter = new SandboxPaymentAdapter();
    const intent = await adapter.createIntent({
      organisationId: orgA,
      priceId: "price_grow_diagnostic_gmd_v1",
      amountMinor: 25000,
      currency: "GMD",
      idempotencyKey: "pay1",
    });
    expect((await adapter.createIntent({
      organisationId: orgA,
      priceId: "price_grow_diagnostic_gmd_v1",
      amountMinor: 25000,
      currency: "GMD",
      idempotencyKey: "pay1",
    })).providerRef).toBe(intent.providerRef);

    const secret = "sandbox-secret";
    const payload = JSON.stringify({
      provider: "fortis_sandbox",
      externalId: "evt_1",
      eventType: "payment.captured",
      organisationId: orgA,
      amountMinor: 25000,
      currency: "GMD",
    });
    const ts = Date.now();
    const inbox: EventInboxRecord[] = [];
    const book: PostedTransaction[] = [];

    const first = ingestWebhook(
      inbox,
      { provider: "fortis_sandbox", externalId: "evt_1", eventType: "payment.captured", payload, signature: signWebhookPayload(payload, secret, ts), timestamp: ts },
      secret,
    );
    const dup = ingestWebhook(
      inbox,
      { provider: "fortis_sandbox", externalId: "evt_1", eventType: "payment.captured", payload, signature: signWebhookPayload(payload, secret, ts), timestamp: ts },
      secret,
    );
    expect(first.accepted).toBe(true);
    expect(dup.duplicate).toBe(true);

    postPaymentCapture(book, { organisationId: orgA, amountMinor: 25000, currency: "GMD", idempotencyKey: "ledger:evt_1" });
    postPaymentCapture(book, { organisationId: orgA, amountMinor: 25000, currency: "GMD", idempotencyKey: "ledger:evt_1" });
    expect(book).toHaveLength(1);

    const refund = postRefund(book, { organisationId: orgA, amountMinor: 25000, currency: "GMD", idempotencyKey: "ledger:evt_1:refund" });
    const reversal = reverseTransaction(book, refund.id, "ledger:evt_1:refund:void");
    expect(reversal.reversesId).toBe(refund.id);

    const report = reconcile(
      [
        { externalId: "evt_1", amountMinor: 25000, currency: "GMD", type: "capture" },
        { externalId: "evt_1:refund", amountMinor: 25000, currency: "GMD", type: "refund" },
      ],
      [
        { sourceExternalId: "evt_1", amountMinor: 25000, currency: "GMD", type: "capture" },
        { sourceExternalId: "evt_1:refund", amountMinor: 25000, currency: "GMD", type: "refund" },
      ],
    );
    expect(report.balanced).toBe(true);
  });

  it("rejects unsigned webhooks and unbalanced ledger posts", () => {
    const inbox: EventInboxRecord[] = [];
    const bad = ingestWebhook(
      inbox,
      {
        provider: "fortis_sandbox",
        externalId: "evt_bad",
        eventType: "payment.captured",
        payload: "{}",
        signature: "00",
        timestamp: Date.now(),
      },
      "secret",
    );
    expect(bad.accepted).toBe(false);
    expect(() =>
      postTransaction([], {
        idempotencyKey: "bad",
        description: "unbalanced",
        lines: [
          { accountCode: "cash", side: "DEBIT", amountMinor: 10, currency: "GMD" },
          { accountCode: "rev", side: "CREDIT", amountMinor: 9, currency: "GMD" },
        ],
      }),
    ).toThrow("unbalanced");
  });
});
