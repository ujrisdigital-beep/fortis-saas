/**
 * ActivityVerification — Refund Guarantee + Compliance Engine
 *
 * Business logic:
 * - A user signs a GuaranteeAgreement when they subscribe.
 * - They must complete `requiredActions` per month to stay eligible for a refund.
 * - This module tracks, scores, and enforces compliance.
 */

import { PrismaClient, Prisma } from "@prisma/client";

type GuaranteeStatus = "ACTIVE" | "AT_RISK" | "COMPLIANT" | "CLAIMED" | "RESOLVED";
type ActivityType = "POST_PUBLISHED" | "STORY_PUBLISHED" | "REEL_PUBLISHED" | "COMMENT_REPLIED" | "DM_SENT" | "LEAD_CAPTURED" | "CONTENT_APPROVED";
type ContentPlatform = "TWITTER" | "INSTAGRAM" | "LINKEDIN" | "FACEBOOK" | "TIKTOK" | "YOUTUBE" | "THREADS" | "CIRCLE";

const prisma = new PrismaClient();

export interface ActivityEntry {
  userId: string;
  brandId: string;
  activityType: ActivityType;
  platform?: ContentPlatform;
  referenceId?: string;
  details?: Record<string, unknown>;
}

export interface ComplianceReport {
  agreementId: string;
  userId: string;
  brandId: string;
  period: { start: string; end: string };
  requiredActions: number;
  completedActions: number;
  compliancePercent: number;
  status: GuaranteeStatus;
  refundEligible: boolean;
  daysRemaining: number;
  gaps: string[];   // what's missing
}

/**
 * Record a single verified user activity.
 */
export async function logActivity(entry: ActivityEntry): Promise<void> {
  await prisma.userActivityLog.create({
    data: {
      userId: entry.userId,
      brandId: entry.brandId,
      activityType: entry.activityType,
      platform: entry.platform,
      referenceId: entry.referenceId,
      details: (entry.details ?? {}) as never,
    },
  });

  // Refresh compliance on every log
  const agreement = await prisma.guaranteeAgreement.findFirst({
    where: { brandId: entry.brandId, userId: entry.userId, status: { in: ["ACTIVE", "AT_RISK"] } },
    orderBy: { startDate: "desc" },
  });

  if (agreement) {
    await refreshCompliance(agreement.id);
  }
}

/**
 * Recount completed actions for the current period and update the agreement.
 */
export async function refreshCompliance(agreementId: string): Promise<void> {
  const agreement = await prisma.guaranteeAgreement.findUniqueOrThrow({
    where: { id: agreementId },
  });

  const count = await prisma.userActivityLog.count({
    where: {
      brandId: agreement.brandId,
      userId: agreement.userId,
      loggedAt: {
        gte: agreement.startDate,
        lte: agreement.endDate,
      },
    },
  });

  const pct = Math.min(100, Math.round((count / agreement.requiredActions) * 100));

  let status: GuaranteeStatus = "ACTIVE";
  if (pct < 25) status = "AT_RISK";
  else if (pct >= 100) status = "COMPLIANT";

  await prisma.guaranteeAgreement.update({
    where: { id: agreementId },
    data: { completedActions: count, status },
  });
}

/**
 * Generate a full compliance report for a given agreement.
 */
export async function getComplianceReport(agreementId: string): Promise<ComplianceReport> {
  const agreement = await prisma.guaranteeAgreement.findUniqueOrThrow({
    where: { id: agreementId },
  });

  const logs = await prisma.userActivityLog.findMany({
    where: {
      brandId: agreement.brandId,
      userId: agreement.userId,
      loggedAt: {
        gte: agreement.startDate,
        lte: agreement.endDate,
      },
    },
    orderBy: { loggedAt: "asc" },
  });

  const now = new Date();
  const endDate = new Date(agreement.endDate);
  const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / 86_400_000));

  const completed = logs.length;
  const pct = Math.min(100, Math.round((completed / agreement.requiredActions) * 100));

  // Compute gaps
  const gaps: string[] = [];
  const activityTypesUsed = new Set(logs.map((l) => l.activityType));
  const allTypes: ActivityType[] = [
    "POST_PUBLISHED",
    "STORY_PUBLISHED",
    "COMMENT_REPLIED",
    "DM_SENT",
    "LEAD_CAPTURED",
  ];
  for (const t of allTypes) {
    if (!activityTypesUsed.has(t)) {
      gaps.push(t.toLowerCase().replace(/_/g, " "));
    }
  }

  const refundEligible =
    agreement.status === "CLAIMED" &&
    completed < Math.floor(agreement.requiredActions * 0.5);

  return {
    agreementId,
    userId: agreement.userId,
    brandId: agreement.brandId,
    period: {
      start: agreement.startDate.toISOString(),
      end: agreement.endDate.toISOString(),
    },
    requiredActions: agreement.requiredActions,
    completedActions: completed,
    compliancePercent: pct,
    status: agreement.status,
    refundEligible,
    daysRemaining,
    gaps,
  };
}

/**
 * Submit a refund claim for a user.
 * Returns the new RefundClaim record.
 */
export async function submitRefundClaim(params: {
  agreementId: string;
  claimantId: string;
  reason: string;
  evidence?: Record<string, unknown>;
}) {
  const agreement = await prisma.guaranteeAgreement.findUniqueOrThrow({
    where: { id: params.agreementId },
  });

  // Guard: user must be the agreement owner
  if (agreement.userId !== params.claimantId) {
    throw new Error("You are not authorised to claim against this agreement.");
  }

  // Guard: no duplicate open claims
  const existing = await prisma.refundClaim.findFirst({
    where: {
      agreementId: params.agreementId,
      status: { in: ["PENDING", "UNDER_REVIEW"] },
    },
  });
  if (existing) {
    throw new Error("A claim is already open for this agreement.");
  }

  const claim = await prisma.refundClaim.create({
    data: {
      agreementId: params.agreementId,
      claimantId: params.claimantId,
      reason: params.reason,
      evidence: (params.evidence ?? {}) as never,
      status: "PENDING",
    },
  });

  // Mark agreement as claimed
  await prisma.guaranteeAgreement.update({
    where: { id: params.agreementId },
    data: { status: "CLAIMED" },
  });

  return claim;
}

/**
 * Admin: resolve a refund claim.
 */
export async function resolveRefundClaim(
  claimId: string,
  decision: "APPROVED" | "REJECTED",
  reviewNotes: string,
) {
  return prisma.refundClaim.update({
    where: { id: claimId },
    data: {
      status: decision,
      reviewNotes,
      resolvedAt: new Date(),
    },
  });
}
