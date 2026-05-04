// app/api/legal/inquiry/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, organization, inquiryType, message } = body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
    }

    const reference = `LEG-${Date.now()}`;
    const ipAddress =
      req.headers.get("x-forwarded-for") ??
      req.headers.get("x-real-ip") ??
      "unknown";

    await prisma.legalInquiry.create({
      data: {
        name: name.trim().slice(0, 100),
        email: email.trim().slice(0, 200),
        organization: organization?.trim().slice(0, 200) || null,
        inquiryType: inquiryType ?? "other",
        message: message.trim().slice(0, 2000),
        reference,
        ipAddress,
        status: "received",
      },
    });

    // Optional email notification via Resend
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        const from = process.env.FROM_EMAIL ?? "noreply@fortisos.gm";

        await Promise.all([
          // Notify legal team
          resend.emails.send({
            from,
            to: "legal@fortisos.gm",
            subject: `Legal Inquiry [${reference}]: ${inquiryType} — ${name}`,
            replyTo: email,
            html: `<h2>Legal Inquiry Received</h2>
              <p><strong>Reference:</strong> ${reference}</p>
              <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
              <p><strong>Organization:</strong> ${organization || "Not provided"}</p>
              <p><strong>Type:</strong> ${inquiryType}</p>
              <hr/>
              <p>${message.replace(/\n/g, "<br/>")}</p>
              <hr/>
              <p><small>FORTIS OS™ — FORTIS INVICTA LTD, Licensed Operator in The Gambia</small></p>`,
          }),
          // Auto-response to sender
          resend.emails.send({
            from,
            to: email,
            subject: `Your legal inquiry to FORTIS OS™ has been received [${reference}]`,
            html: `<h2>Thank you, ${name}</h2>
              <p>FORTIS INVICTA LTD has received your legal inquiry regarding <strong>${inquiryType}</strong>.</p>
              <p>Our legal team will respond within <strong>5 business days</strong>.</p>
              <p><strong>Reference:</strong> ${reference}</p>
              <hr/>
              <p style="font-size:12px;color:#666;">
                FORTIS OS™ is a trademark of UJU GROUP LIMITED, operated under license by FORTIS INVICTA LTD in The Gambia.
                For urgent matters, contact: legal@fortisos.gm
              </p>`,
          }),
        ]);
      } catch (emailErr) {
        console.error("[LEGAL INQUIRY] Email send failed:", emailErr);
      }
    }

    return NextResponse.json({ success: true, reference });
  } catch (err) {
    console.error("[LEGAL INQUIRY] Error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const inquiries = await prisma.legalInquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return NextResponse.json({ inquiries, total: inquiries.length });
  } catch {
    return NextResponse.json({ inquiries: [], total: 0 });
  }
}
