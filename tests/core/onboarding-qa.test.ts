import { describe, expect, it, beforeEach } from "vitest";
import { evaluatePassword } from "../../lib/onboarding/password";
import { isDisposableEmail, isValidEmail, normalizeEmail } from "../../lib/onboarding/email";
import { consumeRateLimit, resetRateLimitForTests } from "../../lib/onboarding/rate-limit";
import { planRegistration } from "../../lib/onboarding/register";
import { hashToken, issueEmailToken, tokenIsValid } from "../../lib/onboarding/verification";

const good = {
  name: "Fatou Jallow",
  email: "fatou@example.com",
  password: "Str0ng-Pilot!99",
  organisationName: "Jallow Farms",
  acceptedTerms: true,
  acceptedPrivacy: true,
};

describe("onboarding QA", () => {
  beforeEach(() => resetRateLimitForTests());

  it("enforces industry-baseline password policy", () => {
    expect(evaluatePassword("short").ok).toBe(false);
    expect(evaluatePassword("alllowercase1!").ok).toBe(false);
    expect(evaluatePassword("NoDigit!!!!AA").ok).toBe(false);
    expect(evaluatePassword("passwordPASSWORD1!").ok).toBe(false);
    expect(evaluatePassword(good.password).ok).toBe(true);
  });

  it("rejects disposable email and privilege self-assignment", () => {
    expect(isValidEmail("bad")).toBe(false);
    expect(isDisposableEmail("a@mailinator.com")).toBe(true);
    expect(normalizeEmail(" A@B.COM ")).toBe("a@b.com");
    expect(planRegistration({ ...good, roleRequest: "CEO" }).ok).toBe(false);
    expect(planRegistration({ ...good, acceptedTerms: false }).ok).toBe(false);
    const ok = planRegistration(good);
    expect(ok.ok && ok.plan.globalRole).toBe("PUBLIC");
    expect(ok.ok && ok.plan.membershipRole).toBe("org_owner");
    expect(ok.ok && ok.plan.requiresEmailVerification).toBe(true);
  });

  it("rate-limits noisy clients", () => {
    expect(consumeRateLimit("ip", 2, 60_000).allowed).toBe(true);
    expect(consumeRateLimit("ip", 2, 60_000).allowed).toBe(true);
    expect(consumeRateLimit("ip", 2, 60_000).allowed).toBe(false);
  });

  it("accepts a one-time unexpired verification token only", () => {
    const issued = issueEmailToken("fatou@example.com", Date.parse("2026-08-23T00:00:00Z"));
    expect(hashToken(issued.raw)).toBe(issued.hash);
    expect(tokenIsValid({ hash: issued.hash, expiresAt: issued.expiresAt, used: false }, issued.raw, Date.parse("2026-08-23T01:00:00Z"))).toBe(true);
    expect(tokenIsValid({ hash: issued.hash, expiresAt: issued.expiresAt, used: true }, issued.raw)).toBe(false);
    expect(tokenIsValid({ hash: issued.hash, expiresAt: issued.expiresAt, used: false }, "nope")).toBe(false);
  });
});
