import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const disposableDomains = ["mailinator.com", "tempmail.com", "10minutemail.com", "guerrillamail.com"];
const allowedRoles = ["CEO", "BOARD", "MANAGER", "CLIENT", "GOVERNMENT", "PUBLIC"] as const;
type AllowedRole = (typeof allowedRoles)[number];

function hasDisposableDomain(email: string) {
  return disposableDomains.some((domain) => email.toLowerCase().endsWith(`@${domain}`));
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      name: string;
      email: string;
      password: string;
      organisation?: string;
      roleRequest?: string;
      sector?: string;
    };

    if (!body.name || !body.email || !body.password) {
      return NextResponse.json({ error: "Name, email, and password are required." }, { status: 400 });
    }

    if (hasDisposableDomain(body.email)) {
      return NextResponse.json({ error: "Disposable email addresses are not allowed." }, { status: 400 });
    }

    const roleRequest = body.roleRequest && allowedRoles.includes(body.roleRequest as AllowedRole)
      ? (body.roleRequest as AllowedRole)
      : "PUBLIC";

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email already registered." }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // Optionally link to organisation
    let orgId: string | undefined;
    if (body.organisation?.trim()) {
      let org = await prisma.organisation.findFirst({ where: { name: body.organisation.trim() } });
      if (!org) {
        org = await prisma.organisation.create({
          data: {
            name: body.organisation.trim(),
            sector: body.sector ?? "general",
            size: "unknown",
            region: "unknown",
            digitalMaturity: 0,
            score: 0,
          },
        });
      }
      orgId = org.id;
    }

    // Create user in database
    const newUser = await prisma.user.create({
      data: {
        email: body.email.toLowerCase(),
        name: body.name,
        password: hashedPassword,
        role: roleRequest,
        ...(orgId ? { orgId } : {}),
      },
    });

    // Send welcome email (non-blocking)
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/welcome-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: body.email,
          name: body.name,
          role: roleRequest,
        }),
      });
    } catch (emailError) {
      console.error("registration welcome email non-blocking error", emailError);
    }

    // Alert admin (non-blocking)
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/welcome-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "ceo@fortisos.co.uk",
          name: "CEO",
          role: `New signup: ${roleRequest}`,
        }),
      });
    } catch (adminAlertError) {
      console.error("registration admin alert non-blocking error", adminAlertError);
    }

    return NextResponse.json({
      ok: true,
      message: "Registration successful.",
      user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role },
    });
  } catch (error) {
    console.error("register error", error);
    return NextResponse.json({ error: "Registration failed." }, { status: 500 });
  }
}
