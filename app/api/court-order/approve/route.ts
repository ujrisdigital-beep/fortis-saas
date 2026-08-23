// app/api/court-order/approve/route.ts
// Court Order Approval — Gambia Data Protection Act compliant
import { NextResponse } from "next/server";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";
import { firstApprove, secondApprove, type DualControlRequest } from "@/lib/govern/dual-control";

const prisma = new PrismaClient();

const SIGNING_SECRET = process.env.COURT_ORDER_VERIFICATION_KEY ?? "fortis-court-order-dev-secret";

function sign(payload: object): string {
  return crypto
    .createHmac("sha256", SIGNING_SECRET)
    .update(JSON.stringify(payload))
    .digest("hex");
}

function hashToken(raw: string): string {
  return crypto.createHash("sha256").update(raw).digest("hex");
}

function verifySignature(record: {
  requestingAdmin: string;
  targetUserId: string;
  reason: string;
  documentHash: string;
  expiresAt: Date;
  signature: string;
}): boolean {
  const payload = {
    requestingAdmin: record.requestingAdmin,
    targetUserId: record.targetUserId,
    reason: record.reason,
    documentHash: record.documentHash,
    expiresAt: record.expiresAt.toISOString(),
  };
  const expected = sign(payload);
  return crypto.timingSafeEqual(
    Buffer.from(expected, "hex"),
    Buffer.from(record.signature, "hex")
  );
}

// POST /api/court-order/approve — Admin: approve or revoke a pending request
export async function POST(req: Request) {
  const adminToken = req.headers.get("x-admin-token");
  const adminId    = req.headers.get("x-admin-id") ?? "unknown";

  if (!adminToken || adminToken !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { requestId?: string; action?: string; revokeReason?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { requestId, action, revokeReason } = body;

  if (!requestId || !action) {
    return NextResponse.json(
      { error: "Missing required fields: requestId, action" },
      { status: 400 }
    );
  }

  if (action !== "approve" && action !== "revoke") {
    return NextResponse.json(
      { error: "action must be 'approve' or 'revoke'" },
      { status: 400 }
    );
  }

  const record = await prisma.courtOrder.findUnique({ where: { id: requestId } });
  if (!record) {
    return NextResponse.json({ error: "Court order request not found" }, { status: 404 });
  }

  // Verify tamper-evident signature before taking action
  if (!verifySignature(record)) {
    await prisma.accessLog.create({
      data: {
        courtOrderId: requestId,
        action: "signature_verification_failed",
        performedBy: adminId,
      },
    });
    return NextResponse.json(
      { error: "Signature verification failed — record may have been tampered with" },
      { status: 422 }
    );
  }

  if (action === "revoke") {
    if (record.status === "revoked") {
      return NextResponse.json({ error: "Already revoked" }, { status: 409 });
    }

    await prisma.courtOrder.update({
      where: { id: requestId },
      data: { status: "revoked", revokedAt: new Date(), revokeReason: revokeReason ?? null },
    });

    await prisma.accessLog.create({
      data: {
        courtOrderId: requestId,
        action: "revoked",
        performedBy: adminId,
      },
    });

    return NextResponse.json({
      message: "Court order access revoked",
      id: requestId,
      revokedAt: new Date().toISOString(),
    });
  }

  // --- APPROVE ---
  if (record.status !== "pending") {
    return NextResponse.json(
      { error: `Cannot approve — current status is '${record.status}'` },
      { status: 409 }
    );
  }

  if (record.expiresAt < new Date()) {
    await prisma.courtOrder.update({
      where: { id: requestId },
      data: { status: "expired" },
    });
    return NextResponse.json({ error: "Court order has expired" }, { status: 410 });
  }

  // Issue a fresh access token (raw never stored — only the SHA-256 hash)
  const rawToken     = crypto.randomBytes(32).toString("hex");
  const tokenHash    = hashToken(rawToken);
  const now          = new Date();

  await prisma.courtOrder.update({
    where: { id: requestId },
    data: {
      status: "active",
      approvedBy: adminId,
      approvedAt: now,
      accessTokenHash: tokenHash,
    },
  });

  await prisma.accessLog.create({
    data: {
      courtOrderId: requestId,
      action: "approved",
      performedBy: adminId,
    },
  });

  // Return the raw token once — it will never be retrievable again
  return NextResponse.json({
    message: "Court order approved. Access token issued.",
    requestId,
    accessToken: rawToken,
    expiresAt: record.expiresAt.toISOString(),
    warning: [
      "Store this token securely — it cannot be retrieved again.",
      "All access is logged under the Gambia Data Protection Act.",
      "Token expires at " + record.expiresAt.toISOString(),
    ],
    auditTrail: {
      approvedBy: adminId,
      approvedAt: now.toISOString(),
      requestingAdmin: record.requestingAdmin,
      documentHash: record.documentHash,
      signature: record.signature,
    },
  });
}

// GET /api/court-order/approve?requestId=xxx — Admin: verify a token against a request
// Used to validate that a raw access token is still valid before releasing PII
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const requestId  = searchParams.get("requestId");
  const token      = req.headers.get("x-access-token");
  const adminToken = req.headers.get("x-admin-token");

  if (!adminToken || adminToken !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!requestId || !token) {
    return NextResponse.json(
      { error: "requestId (query) and x-access-token (header) are required" },
      { status: 400 }
    );
  }

  const record = await prisma.courtOrder.findUnique({ where: { id: requestId } });
  if (!record) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const tokenHash = hashToken(token);
  const tokenValid = crypto.timingSafeEqual(
    Buffer.from(tokenHash, "hex"),
    Buffer.from(record.accessTokenHash, "hex")
  );

  if (!tokenValid) {
    return NextResponse.json({ valid: false, reason: "Invalid token" }, { status: 403 });
  }

  if (record.status === "revoked") {
    return NextResponse.json({ valid: false, reason: "Token has been revoked" }, { status: 403 });
  }

  if (record.expiresAt < new Date()) {
    await prisma.courtOrder.update({ where: { id: requestId }, data: { status: "expired" } });
    return NextResponse.json({ valid: false, reason: "Token has expired" }, { status: 403 });
  }

  if (record.status !== "active") {
    return NextResponse.json(
      { valid: false, reason: `Token is not active (status: ${record.status})` },
      { status: 403 }
    );
  }

  // Log the token use
  const adminId = req.headers.get("x-admin-id") ?? "unknown";
  await prisma.accessLog.create({
    data: {
      courtOrderId: requestId,
      action: "token_used",
      performedBy: adminId,
    },
  });

  return NextResponse.json({
    valid: true,
    targetUserId: record.targetUserId,
    requestingAdmin: record.requestingAdmin,
    reason: record.reason,
    expiresAt: record.expiresAt.toISOString(),
    approvedBy: record.approvedBy,
    approvedAt: record.approvedAt?.toISOString(),
    warning: "Access logged. Returning PII is permitted only for the stated legal reason.",
  });
}
