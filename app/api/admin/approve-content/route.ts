// app/api/admin/approve-content/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireApiAccess } from "@/lib/core/api-guard";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const access = await requireApiAccess("admin", "write");
  if (!access.ok) return access.response;
  try {
    const body = await req.json() as { id: string; action: "approve" | "reject" };

    if (!body.id || !body.action) {
      return NextResponse.json({ error: "id and action required" }, { status: 400 });
    }

    const status = body.action === "approve" ? "approved" : "rejected";

    const item = await prisma.dataContent.update({
      where: { id: body.id },
      data: { status },
    });

    return NextResponse.json({ ok: true, item });
  } catch {
    return NextResponse.json({ ok: false, error: "Failed to update content" }, { status: 500 });
  }
}
