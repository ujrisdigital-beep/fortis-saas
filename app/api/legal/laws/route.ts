// app/api/legal/laws/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const laws = await prisma.gambianLaw.findMany({
      where: { status: "active" },
      orderBy: { year: "asc" },
    });
    return NextResponse.json({ laws, total: laws.length });
  } catch {
    return NextResponse.json({ laws: [], total: 0 });
  }
}
