import { NextResponse } from "next/server";

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[char] ?? char);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { to?: string; name?: string; role?: string };
    if (!body.to || !body.name || !body.role) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM;
    if (!apiKey || !from) {
      return NextResponse.json(
        { ok: false, code: "EMAIL_PROVIDER_NOT_CONFIGURED", error: "Email delivery is unavailable." },
        { status: 503 },
      );
    }

    const name = escapeHtml(body.name.slice(0, 120));
    const role = escapeHtml(body.role.slice(0, 80));
    const appUrl = escapeHtml(process.env.NEXT_PUBLIC_APP_URL ?? "https://fortisos.cloud");
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: body.to,
      subject: "Welcome to FORTIS OS — access received",
      html: `
        <div style="font-family:Arial,sans-serif;background:#112419;color:#fff;padding:24px;border-radius:12px;border:1px solid rgba(201,168,76,.3)">
          <h1 style="margin:0 0 12px;color:#FFD700">Welcome to FORTIS OS</h1>
          <p>Hello ${name},</p>
          <p>Your access request has been received for the role <strong>${role}</strong>.</p>
          <p>Sign in to complete your profile. Access remains subject to verification and entitlements.</p>
          <p style="margin-top:20px"><a href="${appUrl}" style="color:#FFD700">Open FORTIS OS</a></p>
        </div>`,
    });

    if (error) {
      console.error("welcome-email provider error", error);
      return NextResponse.json({ error: "Email provider rejected the message." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("welcome-email error", error);
    return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
  }
}
