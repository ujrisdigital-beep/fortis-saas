// app/api/training/progress/route.ts
// User progress across all enrollments
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') ?? (session?.user as { id?: string } | null)?.id;

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        program: { select: { id: true, title: true, sector: true, level: true, durationWeeks: true } },
        certificate: { select: { certificateNo: true, issueDate: true, verifyHash: true } },
        moduleProgress: true,
      },
      orderBy: { enrolledAt: 'desc' },
    });

    const overallProgress = enrollments.length > 0
      ? Math.round(enrollments.reduce((sum, e) => sum + (e.progress ?? 0), 0) / enrollments.length)
      : 0;

    const completed = enrollments.filter((e) => e.status === 'COMPLETED');
    const active = enrollments.filter((e) => e.status === 'ACTIVE');

    const next = active
      .sort((a, b) => (b.progress ?? 0) - (a.progress ?? 0))
      .slice(0, 3)
      .map((e) => ({
        programId: e.programId,
        title: e.program.title,
        progress: e.progress,
        nextMilestone: e.progress < 25 ? 'Complete first module' : e.progress < 50 ? 'Halfway point' : e.progress < 75 ? 'Final modules' : 'Take assessment',
      }));

    return NextResponse.json({
      userId,
      totalEnrolled: enrollments.length,
      completed: completed.length,
      active: active.length,
      overallProgress,
      certificates: completed.map((e) => e.certificate).filter(Boolean),
      enrollments: enrollments.map((e) => ({
        enrollmentId: e.id,
        programId: e.programId,
        title: e.program.title,
        sector: e.program.sector,
        level: e.program.level,
        progress: e.progress,
        status: e.status,
        enrolledAt: e.enrolledAt,
        completedAt: e.completedAt,
        certificate: e.certificate,
      })),
      nextMilestones: next,
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
