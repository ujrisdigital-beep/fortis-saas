// app/api/admin/alerts/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const alerts = await prisma.adminAlert.findMany({
      where: { isRead: false },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json({ ok: true, alerts });
  } catch {
    return NextResponse.json({ ok: false, error: "Failed to fetch alerts" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json() as { id: string };
    await prisma.adminAlert.update({
      where: { id: body.id },
      data: { isRead: true },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Failed to mark alert" }, { status: 500 });
  }
}
