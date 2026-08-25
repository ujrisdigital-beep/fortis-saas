import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Fail closed: a hash alone is never proof of a credential. */
export async function GET(req: NextRequest) {
  const hash = new URL(req.url).searchParams.get("hash");
  if (!hash) {
    return NextResponse.json({ valid: false, error: "hash parameter is required" }, { status: 400 });
  }
  return NextResponse.json(
    {
      valid: false,
      reason: "registry_lookup_required",
      message: "Use /api/v2/academy/credentials/verify?serial=… against the signed registry. Hash-only checks are not accepted.",
      hash,
    },
    { status: 404 },
  );
}
