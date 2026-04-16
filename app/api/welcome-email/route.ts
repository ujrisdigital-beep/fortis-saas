import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      to: string;
      name: string;
      role: string;
    };

    if (!body.to || !body.name || !body.role) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT ?? 587);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpHost || !smtpUser || !smtpPass) {
      console.log("SMTP not configured. Welcome email skipped.");
      return NextResponse.json({ ok: true, skipped: true });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: false,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const html = `
      <div style="font-family: Inter, Arial, sans-serif; background:#112419; color:#fff; padding:24px; border-radius:12px; border:1px solid rgba(201,168,76,0.3)">
        <h1 style="margin:0 0 12px; color:#FFD700;">Welcome to Fortis Invicta</h1>
        <p>Hello ${body.name},</p>
        <p>Your requested access has been received with role <strong>${body.role}</strong>.</p>
        <p>Next steps: login to your dashboard, complete profile, and submit your first opportunity brief.</p>
        <p style="margin-top:20px;">Platform link: <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}" style="color:#FFD700;">Open Fortis Platform</a></p>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: body.to,
      subject: "Welcome to Fortis Invicta - Your Access is Confirmed",
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("welcome-email error", error);
    return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
  }
}
