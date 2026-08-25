import { NextResponse } from "next/server";
import { getAppServerSession } from "@/lib/auth";
import { isKybReviewer, sandboxUserTestingReady } from "@/lib/commerce/readiness";
import { decideMerchantKyb, listSubmittedKyb } from "@/lib/partner/kyb-store";

async function requireReviewer() {
  const session = await getAppServerSession();
  const userId = session?.user?.id;
  if (!userId) {
    return { ok: false as const, response: NextResponse.json({ error: "unauthenticated" }, { status: 401 }) };
  }
  if (!sandboxUserTestingReady() || !isKybReviewer(userId)) {
    return {
      ok: false as const,
      response: NextResponse.json(
        { error: "kyb_staff_not_provisioned", queue: [], code: "STAFF_REQUIRED" },
        { status: 503 },
      ),
    };
  }
  return { ok: true as const, userId };
}

export async function GET() {
  const access = await requireReviewer();
  if (!access.ok) return access.response;
  return NextResponse.json({ queue: listSubmittedKyb() });
}

export async function POST(request: Request) {
  const access = await requireReviewer();
  if (!access.ok) return access.response;
  if (!isKybReviewer(access.userId)) {
    return NextResponse.json({ error: "not_a_kyb_reviewer", code: "FORBIDDEN" }, { status: 403 });
  }
  const body = (await request.json().catch(() => ({}))) as { merchantId?: string; approve?: boolean };
  if (!body.merchantId) {
    return NextResponse.json({ error: "merchantId required" }, { status: 400 });
  }
  try {
    const row = decideMerchantKyb(body.merchantId, access.userId, Boolean(body.approve));
    return NextResponse.json({
      kyb: row,
      publicCommerceStillClosed: true,
      notice: "Approval is KYB only. Public SKUs stay unpublished until licensed PSP + live signatures.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "invalid" },
      { status: 400 },
    );
  }
}
