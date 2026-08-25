// app/api/legal/compliance-logs/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireApiAccess } from "@/lib/core/api-guard";

const prisma = new PrismaClient();

export async function GET() {
  const access = await requireApiAccess("govern", "admin");
  if (!access.ok) return access.response;
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
