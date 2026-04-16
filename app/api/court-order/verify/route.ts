// app/api/court-order/verify/route.ts
// Court Order PII Access System — Gambia Data Protection Act compliant
import { NextResponse } from "next/server";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";

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

// POST /api/court-order/verify — Submit a court order for review
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const courtOrderFile = formData.get("courtOrder") as File | null;
    const targetUserId   = formData.get("userId") as string | null;
    const reason         = formData.get("reason") as string | null;
    const requestingAdmin = formData.get("requestingAdmin") as string | null;

    if (!courtOrderFile || !targetUserId || !reason || !requestingAdmin) {
      return NextResponse.json(
        { error: "Missing required fields: courtOrder, userId, reason, requestingAdmin" },
        { status: 400 }
      );
    }

    // Hash the court order document — never store the file itself
    const fileBytes = await courtOrderFile.arrayBuffer();
    const documentHash = crypto
      .createHash("sha256")
      .update(Buffer.from(fileBytes))
      .digest("hex");

    // Generate time-limited access token (7 days) — store only the hash
    const rawToken  = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const sigPayload = { requestingAdmin, targetUserId, reason, documentHash, expiresAt: expiresAt.toISOString() };
    const signature  = sign(sigPayload);

    const record = await prisma.courtOrder.create({
      data: {
        requestingAdmin,
        targetUserId,
        reason,
        documentHash,
        accessTokenHash: hashToken(rawToken),
        signature,
        expiresAt,
        status: "pending",
      },
    });

    // Log the submission
    await prisma.accessLog.create({
      data: {
        courtOrderId: record.id,
        action: "submitted",
        performedBy: requestingAdmin,
      },
    });

    return NextResponse.json({
      requestId: record.id,
      status: "pending",
      message: "Court order submitted for admin review. Access will be granted once approved.",
      auditTrail: {
        logId: record.id,
        timestamp: record.createdAt,
        documentHash,
        signature,
      },
      warning: "This request is logged under the Gambia Data Protection Act. Misuse is a criminal offence.",
    });
  } catch (err) {
    console.error("Court order verify error:", err);
    return NextResponse.json({ error: "Submission failed", detail: String(err) }, { status: 500 });
  }
}

// GET /api/court-order/verify — Admin: list all requests or get one
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const requestId  = searchParams.get("requestId");
  const adminToken = req.headers.get("x-admin-token");

  if (!adminToken || adminToken !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (requestId) {
    const record = await prisma.courtOrder.findUnique({
      where: { id: requestId },
      include: { accessLogs: { orderBy: { loggedAt: "desc" }, take: 20 } },
    });
    if (!record) return NextResponse.json({ error: "Request not found" }, { status: 404 });

    const isExpired = record.expiresAt < new Date();
    return NextResponse.json({
      id: record.id,
      requestingAdmin: record.requestingAdmin,
      reason: record.reason,
      status: isExpired ? "expired" : record.status,
      expiresAt: record.expiresAt,
      createdAt: record.createdAt,
      approvedBy: record.approvedBy,
      approvedAt: record.approvedAt,
      // targetUserId deliberately omitted — admin must use token for PII access
      auditLogs: record.accessLogs.map(l => ({
        action: l.action,
        performedBy: l.performedBy,
        loggedAt: l.loggedAt,
      })),
    });
  }

  const [total, active, pending, recent] = await Promise.all([
    prisma.courtOrder.count(),
    prisma.courtOrder.count({ where: { status: "active", expiresAt: { gt: new Date() } } }),
    prisma.courtOrder.count({ where: { status: "pending" } }),
    prisma.courtOrder.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      select: { id: true, requestingAdmin: true, reason: true, status: true, createdAt: true, expiresAt: true },
    }),
  ]);

  return NextResponse.json({ total, active, pending, recent });
}

// DELETE /api/court-order/verify?requestId=xxx — Admin: revoke access
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const requestId   = searchParams.get("requestId");
  const adminToken  = req.headers.get("x-admin-token");
  const revokedBy   = req.headers.get("x-admin-id") ?? "unknown";

  if (!adminToken || adminToken !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!requestId) return NextResponse.json({ error: "requestId required" }, { status: 400 });

  const record = await prisma.courtOrder.findUnique({ where: { id: requestId } });
  if (!record) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.courtOrder.update({
    where: { id: requestId },
    data: { status: "revoked", revokedAt: new Date() },
  });

  await prisma.accessLog.create({
    data: { courtOrderId: requestId, action: "revoked", performedBy: revokedBy },
  });

  return NextResponse.json({ message: "Access token revoked", id: requestId });
}
