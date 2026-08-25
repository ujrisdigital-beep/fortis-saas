// app/api/admin/pending-content/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireApiAccess } from "@/lib/core/api-guard";

const prisma = new PrismaClient();

export async function GET() {
  const access = await requireApiAccess("admin", "read");
  if (!access.ok) return access.response;
  try {
    const items = await prisma.dataContent.findMany({
      where: { status: "pending" },
      orderBy: { createdAt: "desc" },
      include: { source: { select: { name: true, category: true } } },
      take: 50,
    });
    return NextResponse.json({ ok: true, items });
  } catch {
    return NextResponse.json({ ok: false, error: "Failed to fetch pending content" }, { status: 500 });
  }
}
