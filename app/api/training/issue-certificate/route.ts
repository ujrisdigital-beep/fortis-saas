// app/api/training/issue-certificate/route.ts
// Issues a verifiable digital certificate — unique ID, SHA-256 hash
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { requireApiAccess } from "@/lib/core/api-guard";

function generateCertificateNo(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(10000 + Math.random() * 90000);
  return `FORTIS-${year}-${random}`;
}

function generateVerifyHash(certNo: string, userId: string, programId: string, issueDate: string): string {
  const payload = `${certNo}:${userId}:${programId}:${issueDate}:${process.env.CERT_SECRET ?? "fortis-invicta-cert-secret"}`;
  return crypto.createHash("sha256").update(payload).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const access = await requireApiAccess("training", "admin");
    if (!access.ok) return access.response;
    const body = await req.json();
    const { userId, programId, programTitle, userName, score, enrollmentId } = body as {
      userId: string;
      programId: string;
      programTitle: string;
      userName: string;
      score: number;
      enrollmentId: string;
    };

    if (!userId || !programId || !programTitle || !userName || enrollmentId === undefined) {
      return NextResponse.json({ error: "userId, programId, programTitle, userName, enrollmentId are required" }, { status: 400 });
    }

    const issueDate = new Date().toISOString();
    const certificateNo = generateCertificateNo();
    const verifyHash = generateVerifyHash(certificateNo, userId, programId, issueDate);

    const certificate = {
      certificateNo,
      enrollmentId,
      programId,
      userId,
      userName,
      programTitle,
      issueDate,
      verifyHash,
      score,
      issuedBy: "UJU GROUP LIMITED · FORTIS Digital Skills Hub",
      verifyUrl: `/training/verify/${verifyHash}`,
      metadataJson: {
        score,
        completionDate: issueDate,
        platform: "FORTIS OS",
        issuer: "UJU GROUP LIMITED",
        country: "The Gambia",
        standard: "FORTIS Digital Credential Standard v1.0",
      },
    };

    // In production: save to DB via Prisma
    // const saved = await prisma.blockchainCertificate.create({ data: { ... } });

    return NextResponse.json({
      success: true,
      certificate,
      message: `Certificate ${certificateNo} issued successfully. Share your verify URL to prove your qualification.`,
    });
  } catch (err) {
    console.error("issue-certificate error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
