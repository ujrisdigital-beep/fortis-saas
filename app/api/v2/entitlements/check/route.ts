import { NextResponse } from "next/server";
import { authorize } from "@/lib/core/policy";
import { reserveEntitlementCheck, type EntitlementGrant } from "@/lib/core/entitlements";
import { getAppServerSession } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getAppServerSession();
  if (!session?.user?.id || !session.user.orgId) {
    return NextResponse.json({ error: "unauthenticated", code: "UNAUTHENTICATED" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { featureKey?: string } | null;
  if (!body?.featureKey) {
    return NextResponse.json({ error: "invalid_input", code: "INVALID_INPUT" }, { status: 400 });
  }

  const decision = authorize(
    {
      actorId: session.user.id,
      organisationId: session.user.orgId,
      memberships: [],
    },
    "billing",
    "entitlement.check",
  );
  if (!decision.allowed) {
    return NextResponse.json({ error: decision.reason, code: "FORBIDDEN", audit: decision.audit }, { status: 403 });
  }

  const grants: EntitlementGrant[] = [];
  const check = reserveEntitlementCheck({
    grants,
    organisationId: session.user.orgId,
    featureKey: body.featureKey,
  });
  return NextResponse.json({ allowed: check.allowed, reason: check.reason });
}
