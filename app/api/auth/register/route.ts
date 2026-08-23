import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { planRegistration } from "@/lib/onboarding/register";
import { consumeRateLimit } from "@/lib/onboarding/rate-limit";
import { issueEmailToken } from "@/lib/onboarding/verification";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limited = consumeRateLimit(`register:${ip}`, 5, 15 * 60 * 1000);
  if (!limited.allowed) {
    return NextResponse.json({ error: "too_many_requests", code: "RATE_LIMITED" }, { status: 429 });
  }

  try {
    const body = (await req.json()) as {
      name?: string;
      email?: string;
      password?: string;
      organisation?: string;
      organisationName?: string;
      acceptedTerms?: boolean;
      acceptedPrivacy?: boolean;
      roleRequest?: string;
    };

    const planned = planRegistration({
      name: body.name ?? "",
      email: body.email ?? "",
      password: body.password ?? "",
      organisationName: body.organisationName ?? body.organisation ?? "",
      acceptedTerms: Boolean(body.acceptedTerms),
      acceptedPrivacy: Boolean(body.acceptedPrivacy),
      roleRequest: body.roleRequest,
    });
    if (!planned.ok) {
      return NextResponse.json({ error: planned.error, code: planned.code }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: planned.plan.email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered.", code: "CONFLICT" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(body.password ?? "", 12);
    const org = await prisma.organisation.create({
      data: {
        name: planned.plan.organisationName,
        sector: "general",
        size: "unknown",
        region: "GM",
        digitalMaturity: 0,
        score: 0,
      },
    });

    const newUser = await prisma.user.create({
      data: {
        email: planned.plan.email,
        name: planned.plan.name,
        password: hashedPassword,
        role: "PUBLIC",
        orgId: org.id,
      },
    });

    await prisma.organisationMembership.create({
      data: {
        organisationId: org.id,
        userId: newUser.id,
        roleKey: "org_owner",
        status: "ACTIVE",
        activatedAt: new Date(),
      },
    });

    const token = issueEmailToken(planned.plan.email);
    await prisma.emailVerificationToken.create({
      data: {
        email: planned.plan.email,
        token: token.hash,
        expiresAt: new Date(token.expiresAt),
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Registration accepted. Verify your email before using GROW writes.",
      verificationRequired: true,
      user: { id: newUser.id, email: newUser.email, name: newUser.name, role: "PUBLIC" },
      // raw token only when no mailer is configured (dev/pilot)
      verificationToken: process.env.RESEND_API_KEY ? undefined : token.raw,
    });
  } catch (error) {
    console.error("register error", error);
    return NextResponse.json({ error: "Registration failed.", code: "INTERNAL" }, { status: 500 });
  }
}
