// app/api/training/verify/route.ts
// Public certificate verification — anyone can check authenticity
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const dynamic = "force-dynamic";

function recomputeHash(certNo: string, userId: string, programId: string, issueDate: string): string {
  const payload = `${certNo}:${userId}:${programId}:${issueDate}:${process.env.CERT_SECRET ?? "fortis-invicta-cert-secret"}`;
  return crypto.createHash("sha256").update(payload).digest("hex");
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const hash = searchParams.get("hash");

    if (!hash) {
      return NextResponse.json({ error: "hash parameter is required" }, { status: 400 });
    }

    // In production: query DB
    // const cert = await prisma.blockchainCertificate.findUnique({ where: { verifyHash: hash } });
    // if (!cert) return NextResponse.json({ valid: false, message: "Certificate not found" }, { status: 404 });
    // const recomputed = recomputeHash(cert.certificateNo, cert.userId, cert.programId, cert.issueDate.toISOString());
    // const valid = recomputed === hash;

    // Demo mode: hash format validation only
    const isValidFormat = /^[a-f0-9]{64}$/.test(hash);
    if (!isValidFormat) {
      return NextResponse.json({ valid: false, message: "Invalid certificate hash format" }, { status: 400 });
    }

    return NextResponse.json({
      valid: true,
      message: "Certificate hash format is valid. Connect database to verify full certificate details.",
      hash,
      checkedAt: new Date().toISOString(),
      issuer: "UJU GROUP LIMITED · FORTIS Digital Skills Hub",
      note: "In production, this endpoint queries the FORTIS certificate registry and returns full certificate metadata.",
    });
  } catch (err) {
    console.error("verify error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
