import { createAuditEvent } from "./audit";
import { roleAllows, type PolicyAction, type PolicyApplet } from "./permissions";

export type MembershipStatus = "INVITED" | "ACTIVE" | "SUSPENDED" | "REVOKED";

export interface Membership {
  organisationId: string;
  userId: string;
  roleKey: string;
  status: MembershipStatus;
}

export interface PolicyContext {
  actorId: string;
  organisationId: string;
  memberships: Membership[];
  sessionRevoked?: boolean;
  emailVerified?: boolean;
  stepUpSatisfied?: boolean;
  requiresStepUp?: boolean;
}

export interface PolicyDecision {
  allowed: boolean;
  reason: string;
  audit?: ReturnType<typeof createAuditEvent>;
}

export function authorize(
  ctx: PolicyContext,
  applet: PolicyApplet,
  action: PolicyAction,
  resource = "*",
): PolicyDecision {
  if (ctx.sessionRevoked) {
    return deny(ctx, applet, action, "session_revoked");
  }
  if (ctx.emailVerified === false) {
    return deny(ctx, applet, action, "email_unverified");
  }
  if (ctx.requiresStepUp && !ctx.stepUpSatisfied) {
    return deny(ctx, applet, action, "step_up_required");
  }

  const membership = ctx.memberships.find(
    (m) => m.userId === ctx.actorId && m.organisationId === ctx.organisationId && m.status === "ACTIVE",
  );
  if (!membership) {
    return deny(ctx, applet, action, "no_active_membership");
  }
  if (!roleAllows(membership.roleKey, applet, action, resource)) {
    return deny(ctx, applet, action, "insufficient_role");
  }
  return { allowed: true, reason: "ok" };
}

function deny(
  ctx: PolicyContext,
  applet: PolicyApplet,
  action: PolicyAction,
  reason: string,
): PolicyDecision {
  return {
    allowed: false,
    reason,
    audit: createAuditEvent({
      type: "audit.sensitive_access",
      organisationId: ctx.organisationId,
      actorId: ctx.actorId,
      correlationId: `${ctx.actorId}:${applet}:${action}`,
      payload: { applet, action, reason, denied: true },
    }),
  };
}
