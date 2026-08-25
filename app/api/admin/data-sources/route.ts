// app/api/admin/data-sources/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireApiAccess } from "@/lib/core/api-guard";

const prisma = new PrismaClient();

export async function GET() {
  const access = await requireApiAccess("admin", "read");
  if (!access.ok) return access.response;
  try {
    const sources = await prisma.dataSource.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { contents: true, updateLogs: true } },
      },
    });
    return NextResponse.json({ ok: true, sources });
  } catch {
    return NextResponse.json({ ok: false, error: "Failed to fetch sources" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const access = await requireApiAccess("admin", "write");
  if (!access.ok) return access.response;
  try {
    const body = await req.json() as {
      name: string;
      type: string;
      url?: string;
      category: string;
      fetchInterval?: number;
    };

    if (!body.name || !body.type || !body.category) {
      return NextResponse.json({ error: "name, type, and category are required" }, { status: 400 });
    }

    const source = await prisma.dataSource.create({
      data: {
        name: body.name,
        type: body.type,
        url: body.url,
        category: body.category,
        fetchInterval: body.fetchInterval ?? 1440,
      },
    });

    return NextResponse.json({ ok: true, source }, { status: 201 });
  } catch {
    return NextResponse.json({ ok: false, error: "Failed to create source" }, { status: 500 });
  }
}
