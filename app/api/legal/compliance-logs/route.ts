// app/api/legal/compliance-logs/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const logs = await prisma.legalComplianceLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return NextResponse.json({ logs, total: logs.length });
  } catch {
    return NextResponse.json({ logs: [], total: 0 });
  }
}
