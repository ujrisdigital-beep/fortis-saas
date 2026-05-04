import { NextResponse } from "next/server";
import { checkAllUserBatches, type BatchUser } from "@/lib/batch-manager";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: { role: { not: "SUPER_ADMIN" } },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    const batchUsers: BatchUser[] = users.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      creditsUsed: 0,
      creditsLimit: 0,
    }));

    const warnings = await checkAllUserBatches(batchUsers);

    return NextResponse.json({
      checkedAt: new Date().toISOString(),
      totalUsers: users.length,
      warnings: warnings.map((w) => ({
        userId: w.user.id,
        email: w.user.email,
        name: w.user.name,
        level: w.level,
        percentage: w.percentage,
        message: w.message,
      })),
    });
  } catch {
    return NextResponse.json({ error: "Failed to check batches" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, percentage } = body;
    if (!userId || percentage === undefined) {
      return NextResponse.json({ error: "Missing userId or percentage" }, { status: 400 });
    }

    return NextResponse.json({ success: true, userId, percentage });
  } catch {
    return NextResponse.json({ error: "Failed to log warning" }, { status: 500 });
  }
}