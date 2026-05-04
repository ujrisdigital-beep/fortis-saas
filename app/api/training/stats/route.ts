// app/api/training/stats/route.ts
// Returns training platform stats — 0 if no data, never null
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const revalidate = 300; // Cache for 5 minutes

export async function GET() {
  try {
    const [courses, enrollments, certificates, employers] = await Promise.all([
      prisma.trainingProgram.count({ where: { status: 'PUBLISHED' } }),
      prisma.enrollment.count(),
      prisma.blockchainCertificate.count(),
      prisma.employerPartnership.count({ where: { isVerified: true } }),
    ]);

    return NextResponse.json({
      courses: courses || 0,
      enrollments: enrollments || 0,
      certificates: certificates || 0,
      employers: employers || 0,
      sectors: 5,
      free: true,
      cachedAt: new Date().toISOString(),
    });
  } catch {
    // Graceful fallback — never return null
    return NextResponse.json({
      courses: 0, enrollments: 0, certificates: 0,
      employers: 0, sectors: 5, free: true,
      cachedAt: new Date().toISOString(),
    });
  }
}
