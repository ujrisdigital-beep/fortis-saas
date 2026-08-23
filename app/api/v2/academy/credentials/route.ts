import { NextResponse } from "next/server";
import { requireApiAccess } from "@/lib/core/api-guard";
import { newSerial, signCredential } from "@/lib/academy/credentials";
import { saveCredential } from "@/lib/academy/registry";

export async function POST(request: Request) {
  const access = await requireApiAccess("training", "admin");
  if (!access.ok) return access.response;
  const secret = process.env.FORTIS_CREDENTIAL_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "credential_signing_unconfigured", code: "UNCONFIGURED" }, { status: 503 });
  }
  const body = (await request.json().catch(() => null)) as {
    learnerId?: string;
    programId?: string;
    programTitle?: string;
  } | null;
  if (!body?.learnerId || !body.programId || !body.programTitle) {
    return NextResponse.json({ error: "incomplete", code: "INVALID_INPUT" }, { status: 400 });
  }
  const record = signCredential(
    {
      serial: newSerial(),
      learnerId: body.learnerId,
      programId: body.programId,
      programTitle: body.programTitle,
      issuedAt: new Date().toISOString(),
    },
    secret,
  );
  saveCredential(record);
  return NextResponse.json({ credential: record, chain: "none", claim: "hmac-signed-registry" });
}
