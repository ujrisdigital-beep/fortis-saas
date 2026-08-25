import { evaluatePassword } from "./password";
import { isDisposableEmail, isValidEmail, normalizeEmail } from "./email";

export interface RegisterCommand {
  name: string;
  email: string;
  password: string;
  organisationName: string;
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
  roleRequest?: string;
}

export interface RegisterPlan {
  email: string;
  name: string;
  organisationName: string;
  globalRole: "PUBLIC";
  membershipRole: "org_owner";
  requiresEmailVerification: true;
}

export function planRegistration(input: RegisterCommand):
  | { ok: true; plan: RegisterPlan }
  | { ok: false; error: string; code: string } {
  const name = input.name.trim();
  const email = normalizeEmail(input.email);
  const organisationName = input.organisationName.trim();

  if (!name || name.length < 2) return { ok: false, error: "name_required", code: "INVALID_INPUT" };
  if (!isValidEmail(email)) return { ok: false, error: "invalid_email", code: "INVALID_INPUT" };
  if (isDisposableEmail(email)) return { ok: false, error: "disposable_email", code: "INVALID_INPUT" };
  const password = evaluatePassword(input.password);
  if (!password.ok) return { ok: false, error: password.reasons.join(","), code: "WEAK_PASSWORD" };
  if (!organisationName) return { ok: false, error: "organisation_required", code: "INVALID_INPUT" };
  if (!input.acceptedTerms || !input.acceptedPrivacy) {
    return { ok: false, error: "consent_required", code: "CONSENT_REQUIRED" };
  }
  if (input.roleRequest && input.roleRequest !== "PUBLIC") {
    return { ok: false, error: "role_not_self_assignable", code: "FORBIDDEN" };
  }

  return {
    ok: true,
    plan: {
      email,
      name,
      organisationName,
      globalRole: "PUBLIC",
      membershipRole: "org_owner",
      requiresEmailVerification: true,
    },
  };
}
