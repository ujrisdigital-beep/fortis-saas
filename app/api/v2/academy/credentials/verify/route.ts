import { NextResponse } from "next/server";
import { verifyCredential } from "@/lib/academy/credentials";
import { findCredential } from "@/lib/academy/registry";

export async function GET(request: Request) {
  const serial = new URL(request.url).searchParams.get("serial");
  if (!serial) {
    return NextResponse.json({ valid: false, reason: "serial_required" }, { status: 400 });
  }
  const secret = process.env.FORTIS_CREDENTIAL_SECRET;
  const stored = findCredential(serial);
  if (!secret || !stored) {
    return NextResponse.json({ valid: false, reason: "not_found" }, { status: 404 });
  }
  const result = verifyCredential(stored, secret);
  return NextResponse.json({ ...result, serial, issuer: "FORTIS ACADEMY", chain: "none" });
}
