import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Target email — server-side only, never exposed to client
const TARGET_EMAIL = "fortisinvictaprojects@gmail.com";
const FROM_DOMAIN = "fortisos.cloud";

export async function POST(req: NextRequest) {
  let body: { name?: string; email?: string; organisation?: string; message?: string; subject?: string; type?: string };

  try {
    body = await req.json() as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, organisation, message, subject, type } = body;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const emailSubject = `[FORTIS OS] ${subject ?? "General Inquiry"} from ${name.trim()}`;
  const emailHtml = `
    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #0A2E1A, #1B4D3E); padding: 24px; border-radius: 12px 12px 0 0;">
        <h2 style="color: #fff; margin: 0; font-size: 20px;">📧 ${emailSubject}</h2>
      </div>
      <div style="background: #F9FAFB; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #E5E7EB;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; font-weight: bold; color: #374151; width: 140px;">From:</td><td style="padding: 8px 0; color: #111;">${name.trim()}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Email:</td><td style="padding: 8px 0; color: #111;"><a href="mailto:${email.trim()}">${email.trim()}</a></td></tr>
          ${organisation?.trim() ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Organisation:</td><td style="padding: 8px 0; color: #111;">${organisation.trim()}</td></tr>` : ""}
          <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Type:</td><td style="padding: 8px 0; color: #111;">${type ?? "general"}</td></tr>
        </table>
        <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 16px 0;" />
        <h3 style="color: #374151; font-size: 14px; margin: 0 0 8px;">Message:</h3>
        <div style="background: #fff; border-radius: 8px; padding: 16px; color: #374151; line-height: 1.6; white-space: pre-wrap;">${message.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
        <p style="margin-top: 20px; font-size: 11px; color: #9CA3AF;">Sent via FORTIS OS Contact Form · fortisos.cloud</p>
      </div>
    </div>
  `;

  const resendKey = process.env.RESEND_API_KEY;

  if (resendKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: `FORTIS OS <contact@${FROM_DOMAIN}>`,
          to: TARGET_EMAIL,
          reply_to: email.trim(),
          subject: emailSubject,
          html: emailHtml,
        }),
      });

      if (res.ok) {
        return NextResponse.json({ success: true });
      }

      const errText = await res.text();
      console.error("[contact] Resend error:", errText);
      // Fall through to console fallback
    } catch (err) {
      console.error("[contact] Resend fetch error:", err);
    }
  }

  // Fallback: log submission server-side (still returns success to user)
  console.log("=== CONTACT FORM SUBMISSION ===");
  console.log("To:", TARGET_EMAIL);
  console.log("Subject:", emailSubject);
  console.log("From:", email.trim(), organisation ? `(${organisation.trim()})` : "");
  console.log("Message:", message.trim());
  console.log("================================");

  return NextResponse.json({ success: true });
}
