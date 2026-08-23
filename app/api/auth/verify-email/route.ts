import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { tokenIsValid } from "@/lib/onboarding/verification";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { email?: string; token?: string } | null;
  if (!body?.email || !body.token) {
    return NextResponse.json({ error: "email_and_token_required", code: "INVALID_INPUT" }, { status: 400 });
  }

  const rows = await prisma.emailVerificationToken.findMany({
    where: { email: body.email.toLowerCase(), used: false },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
  const match = rows.find((row) =>
    tokenIsValid({ hash: row.token, expiresAt: row.expiresAt.toISOString(), used: row.used }, body.token!),
  );
  if (!match) {
    return NextResponse.json({ error: "invalid_or_expired", code: "INVALID_TOKEN" }, { status: 400 });
  }

  await prisma.emailVerificationToken.update({ where: { id: match.id }, data: { used: true } });
  await prisma.user.update({
    where: { email: body.email.toLowerCase() },
    data: { emailVerified: new Date() },
  });
  return NextResponse.json({ ok: true, verified: true });
}
