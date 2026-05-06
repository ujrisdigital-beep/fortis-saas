// Dashboard Analytics Engine for Ombudsman Module

import { prisma } from '@/lib/prisma';

export interface DashboardSummary {
  totalCases: number;
  received: number;
  investigating: number;
  resolved: number;
  closed: number;
  avgResolutionDays: number;
  complianceRate: number;
  citizenSatisfactionAvg: number;
}

export interface MDAComplaintStats {
  mda: string;
  mdaId: string;
  totalComplaints: number;
  resolved: number;
  avgResolutionDays: number;
  complianceRate: number;
  trend: 'up' | 'down' | 'stable';
}

export interface IntegrityDistribution {
  high: number;    // 70-100
  medium: number;  // 40-69
  low: number;     // 0-39
}

export async function getDashboardData(): Promise<{
  summary: DashboardSummary;
  complaintsByMDA: MDAComplaintStats[];
  integrityDistribution: IntegrityDistribution;
  recentCases: any[];
  monthlyTrend: { month: string; cases: number; resolved: number }[];
}> {
  // Get all cases for dashboard
  const totalCases = await prisma.ombudsmanCase.count();
  const received = await prisma.ombudsmanCase.count({ where: { status: 'RECEIVED' } });
  const investigating = await prisma.ombudsmanCase.count({ where: { status: 'INVESTIGATING' } });
  const resolved = await prisma.ombudsmanCase.count({ where: { status: 'RESOLVED' } });
  const closed = await prisma.ombudsmanCase.count({ where: { status: 'CLOSED' } });

  // Average resolution time (in days)
  const resolvedCases = await prisma.ombudsmanCase.findMany({
    where: { resolvedAt: { not: null } },
    select: { createdAt: true, resolvedAt: true },
  });

  const avgResolutionDays = resolvedCases.length > 0
    ? resolvedCases.reduce((acc, c) => {
        const days = (c.resolvedAt!.getTime() - c.createdAt.getTime()) / (1000 * 60 * 60 * 24);
        return acc + days;
      }, 0) / resolvedCases.length
    : 0;

  // MDA Compliance Rate
  const recommendations = await prisma.ombudsmanRecommendation.findMany();
  const compliantMDAs = recommendations.filter(r => r.isCompliant === true).length;
  const complianceRate = recommendations.length > 0
    ? (compliantMDAs / recommendations.length) * 100
    : 0;

  // Citizen satisfaction average
  const satisfactionCases = await prisma.ombudsmanCase.findMany({
    where: { citizenSatisfaction: { not: null } },
    select: { citizenSatisfaction: true },
  });
  const citizenSatisfactionAvg = satisfactionCases.length > 0
    ? satisfactionCases.reduce((acc, c) => acc + (c.citizenSatisfaction || 0), 0) / satisfactionCases.length
    : 0;

  // Complaints by MDA
  const complaintsByMDARaw = await prisma.ombudsmanCase.groupBy({
    by: ['mdaId', 'mdaName'],
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: 15,
  });

  // Get resolved counts per MDA
  const complaintsByMDA: MDAComplaintStats[] = await Promise.all(
    complaintsByMDARaw.map(async (item) => {
      const mdaResolved = await prisma.ombudsmanCase.count({
        where: { mdaId: item.mdaId, status: 'RESOLVED' },
      });

      // Calculate trend (compare last 30 days vs previous 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

      const recentCount = await prisma.ombudsmanCase.count({
        where: { mdaId: item.mdaId, createdAt: { gte: thirtyDaysAgo } },
      });
      const previousCount = await prisma.ombudsmanCase.count({
        where: { mdaId: item.mdaId, createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } },
      });

      const trend: 'up' | 'down' | 'stable' = recentCount > previousCount
        ? 'up'
        : recentCount < previousCount
          ? 'down'
          : 'stable';

      return {
        mda: item.mdaName,
        mdaId: item.mdaId,
        totalComplaints: item._count.id,
        resolved: mdaResolved,
        avgResolutionDays: avgResolutionDays, // Simplified - could be per MDA
        complianceRate,
        trend,
      };
    })
  );

  // Integrity score distribution
  const highIntegrity = await prisma.ombudsmanCase.count({
    where: { ujrisIntegrityScore: { gte: 70 } },
  });
  const mediumIntegrity = await prisma.ombudsmanCase.count({
    where: { ujrisIntegrityScore: { gte: 40, lt: 70 } },
  });
  const lowIntegrity = await prisma.ombudsmanCase.count({
    where: { ujrisIntegrityScore: { lt: 40 } },
  });

  const integrityDistribution: IntegrityDistribution = {
    high: highIntegrity,
    medium: mediumIntegrity,
    low: lowIntegrity,
  };

  // Recent cases
  const recentCases = await prisma.ombudsmanCase.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  // Monthly trend (last 12 months)
  const monthlyTrend = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const monthCases = await prisma.ombudsmanCase.count({
      where: { createdAt: { gte: monthStart, lte: monthEnd } },
    });
    const monthResolved = await prisma.ombudsmanCase.count({
      where: {
        resolvedAt: { gte: monthStart, lte: monthEnd },
      },
    });

    monthlyTrend.push({
      month: monthStart.toLocaleString('default', { month: 'short', year: '2-digit' }),
      cases: monthCases,
      resolved: monthResolved,
    });
  }

  return {
    summary: {
      totalCases,
      received,
      investigating,
      resolved,
      closed,
      avgResolutionDays: Math.round(avgResolutionDays),
      complianceRate: Math.round(complianceRate),
      citizenSatisfactionAvg: Math.round(citizenSatisfactionAvg * 10) / 10,
    },
    complaintsByMDA,
    integrityDistribution,
    recentCases,
    monthlyTrend,
  };
}
