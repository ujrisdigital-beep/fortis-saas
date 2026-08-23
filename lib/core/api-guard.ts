import { NextResponse } from "next/server";
import { getAppServerSession } from "@/lib/auth";
import { authorize, type Membership, type PolicyContext } from "./policy";
import type { PolicyAction, PolicyApplet } from "./permissions";
import { loadActiveMemberships } from "./memberships";

export interface GuardedSession {
  userId: string;
  organisationId: string;
  memberships: Membership[];
}

export async function requireApiAccess(
  applet: PolicyApplet,
  action: PolicyAction,
  options?: { requireOrg?: boolean; resource?: string; stepUp?: boolean },
): Promise<{ ok: true; session: GuardedSession } | { ok: false; response: NextResponse }> {
  const session = await getAppServerSession();
  const userId = session?.user?.id;
  if (!userId) {
    return {
      ok: false,
      response: NextResponse.json({ error: "unauthenticated", code: "UNAUTHENTICATED" }, { status: 401 }),
    };
  }

  const organisationId = session.user.orgId ?? "";
  if (options?.requireOrg !== false && !organisationId) {
    return {
      ok: false,
      response: NextResponse.json({ error: "no_organisation", code: "FORBIDDEN" }, { status: 403 }),
    };
  }

  const memberships = await loadActiveMemberships(userId);
  const ctx: PolicyContext = {
    actorId: userId,
    organisationId,
    memberships,
    emailVerified: Boolean(session.user.email),
    requiresStepUp: options?.stepUp,
    stepUpSatisfied: false,
  };
  const decision = authorize(ctx, applet, action, options?.resource ?? "*");
  if (!decision.allowed) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: decision.reason, code: "FORBIDDEN", audit: decision.audit },
        { status: 403 },
      ),
    };
  }
  return { ok: true, session: { userId, organisationId, memberships } };
}

export function forbidTenantSpoof(claimedOrgId: string | undefined, trustedOrgId: string): boolean {
  return Boolean(claimedOrgId && claimedOrgId !== trustedOrgId);
}
