import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const mdaId = searchParams.get('mdaId');
    const assignedTo = searchParams.get('assignedTo');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: any = {};

    if (status) where.status = status;
    if (mdaId) where.mdaId = mdaId;
    if (assignedTo) where.assignedTo = assignedTo;

    if (search) {
      where.OR = [
        { caseNumber: { contains: search, mode: 'insensitive' } },
        { complainantName: { contains: search, mode: 'insensitive' } },
        { mdaName: { contains: search, mode: 'insensitive' } },
        { complaintText: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [cases, total] = await Promise.all([
      prisma.ombudsmanCase.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.ombudsmanCase.count({ where }),
    ]);

    return NextResponse.json({
      cases,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching cases:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cases' },
      { status: 500 }
    );
  }
}
