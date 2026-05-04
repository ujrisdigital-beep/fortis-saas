// app/api/testimonials/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Fetch approved testimonials
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get('featured') === 'true';

    const testimonials = await prisma.testimonial.findMany({
      where: { approved: true, ...(featured ? { featured: true } : {}) },
      orderBy: [{ featured: 'desc' }, { submittedAt: 'desc' }],
      take: 50,
    });
    return NextResponse.json({ testimonials, total: testimonials.length });
  } catch {
    return NextResponse.json({ testimonials: [], total: 0 });
  }
}

// POST: Submit new testimonial (requires admin approval)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { authorName, authorRole, businessName, content, rating } = body;

    if (!authorName?.trim() || !authorRole?.trim() || !content?.trim()) {
      return NextResponse.json({ error: 'Name, role, and content are required.' }, { status: 400 });
    }
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5.' }, { status: 400 });
    }
    if (content.length < 50) {
      return NextResponse.json({ error: 'Testimonial must be at least 50 characters.' }, { status: 400 });
    }

    const ipAddress = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown';
    const userAgent = req.headers.get('user-agent') ?? 'unknown';

    await prisma.testimonial.create({
      data: {
        authorName: authorName.trim().slice(0, 100),
        authorRole: authorRole.trim().slice(0, 100),
        businessName: businessName?.trim().slice(0, 100) || null,
        content: content.trim().slice(0, 500),
        rating,
        approved: false,
        featured: false,
        ipAddress,
        userAgent: userAgent.slice(0, 200),
      },
    });

    return NextResponse.json({ success: true, message: 'Testimonial submitted for review.' });
  } catch (err) {
    console.error('Testimonial submission error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
