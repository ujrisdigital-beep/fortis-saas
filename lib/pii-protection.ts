import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface CourtOrderInput {
  id: string;
  requestingAdmin?: string;
  reason?: string;
  expiresAt?: string;
}

export interface PIIAccessRequest {
  userId: string;
  courtOrder: CourtOrderInput;
  ipAddress?: string;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function isWithinDays(date: string | Date, days: number): boolean {
  const d = new Date(date);
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  return diff > 0 && diff <= days * 24 * 60 * 60 * 1000;
}

export async function verifyCourtOrder(order: CourtOrderInput): Promise<boolean> {
  if (!order.id) return false;
  if (order.expiresAt && !isWithinDays(order.expiresAt, 7)) return false;
  try {
    const existing = await prisma.courtOrder.findUnique({ where: { id: order.id } });
    return !!existing;
  } catch {
    return false;
  }
}

export async function requestPIIAccess(req: PIIAccessRequest): Promise<{ accessToken: string; expiresAt: string; success: boolean }> {
  const isValid = await verifyCourtOrder(req.courtOrder);
  if (!isValid) {
    await logAccessAttempt(req.courtOrder.id, req.ipAddress, "denied", "Invalid court order");
    return { accessToken: "", expiresAt: "", success: false };
  }

  const expiresAt = addDays(new Date(), 7);
  const token = `pii_${Buffer.from(`${req.userId}:${req.courtOrder.id}:${expiresAt.toISOString()}`).toString("base64")}`;

  await logAccessAttempt(req.courtOrder.id, req.ipAddress, "approved");

  return { accessToken: token, expiresAt: expiresAt.toISOString(), success: true };
}

async function logAccessAttempt(
  courtOrderId: string,
  ipAddress: string | undefined,
  action: string,
  reason?: string
): Promise<void> {
  try {
    await prisma.accessLog.create({
      data: {
        courtOrderId,
        action,
        performedBy: "system",
        ipAddress: ipAddress || null,
        dataCategory: null,
      },
    });
  } catch {
    // non-fatal
  }
}

export async function checkPIIAccessLogs(limit = 50) {
  try {
    return await prisma.accessLog.findMany({
      where: { courtOrderId: { not: "" } },
      orderBy: { loggedAt: "desc" },
      take: limit,
    });
  } catch {
    return [];
  }
}

export async function revokePIIAccess(token: string): Promise<boolean> {
  try {
    await prisma.courtOrder.updateMany({
      where: { id: { contains: token.slice(4, 20) } },
      data: { status: "revoked" },
    });
    return true;
  } catch {
    return false;
  }
}

export const PII_PROTECTION_RULES = {
  accessRequiresCourtOrder: true,
  courtOrderValidityDays: 7,
  encryptionRequired: true,
  noHumanAccessWithoutOrder: true,
} as const;