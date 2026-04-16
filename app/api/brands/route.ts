/**
 * GET  /api/brands            — list brands for the current user
 * POST /api/brands            — create a new brand
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { PrismaClient } from "@prisma/client";
import { seedDefaultTemplates } from "../../../lib/brand-brain";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const memberships = await prisma.brandMember.findMany({
    where: { userId: session.user.id ?? "" },
    include: { brand: true },
  });

  const brands = memberships.map((m) => ({
    ...m.brand,
    memberRole: m.role,
  }));

  return NextResponse.json(brands);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const body = await req.json() as {
    name?: string;
    handle?: string;
    niche?: string;
    voiceTone?: string;
    primaryColor?: string;
  };

  if (!body.name || !body.handle || !body.niche) {
    return NextResponse.json({ error: "name, handle, and niche are required." }, { status: 400 });
  }

  // Sanitize handle
  const handle = body.handle.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase();

  // Check handle uniqueness
  const existing = await prisma.brand.findUnique({ where: { handle } });
  if (existing) {
    return NextResponse.json({ error: "That handle is already taken." }, { status: 409 });
  }

  const userId = session.user.id ?? "";

  const brand = await prisma.brand.create({
    data: {
      name: body.name,
      handle,
      niche: body.niche,
      voiceTone: body.voiceTone,
      primaryColor: body.primaryColor,
      ownerId: userId,
      members: {
        create: { userId, role: "OWNER" },
      },
    },
  });

  // Seed default prompt templates for this brand
  await seedDefaultTemplates(brand.id);

  return NextResponse.json(brand, { status: 201 });
}
