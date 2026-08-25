// app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Always return success — never reveal whether email exists (security)
    const successResponse = NextResponse.json({
      success: true,
      message: 'If an account exists for this email, a reset code has been sent.',
    });

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user) return successResponse;

    // Invalidate any existing unused tokens for this email
    await prisma.passwordResetToken.updateMany({
      where: { email: email.toLowerCase().trim(), used: false },
      data: { used: true },
    });

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const tokenHash = crypto.createHash('sha256').update(code).digest('hex');

    await prisma.passwordResetToken.create({
      data: {
        email: email.toLowerCase().trim(),
        token: tokenHash,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    // Send email via Resend
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.FROM_EMAIL ?? 'FORTIS OS <noreply@fortisos.cloud>',
        to: email,
        subject: 'Your FORTIS OS Password Reset Code',
        html: `
          <div style="font-family: 'DM Sans', sans-serif; max-width: 480px; margin: 0 auto; background: #F8FAFC; padding: 2rem; border-radius: 12px;">
            <div style="background: linear-gradient(135deg, #0F3D21, #1B4D3E); padding: 1.5rem; border-radius: 10px 10px 0 0; text-align: center; margin: -2rem -2rem 2rem;">
              <h1 style="color: #C4943A; margin: 0; font-size: 1.4rem;">FORTIS OS™</h1>
              <p style="color: rgba(255,255,255,0.6); margin: 0.3rem 0 0; font-size: 0.85rem;">Password Reset</p>
            </div>
            <p style="color: #374151; font-size: 0.95rem;">Hello,</p>
            <p style="color: #374151; font-size: 0.95rem;">Use the code below to reset your FORTIS OS password. This code expires in <strong>1 hour</strong>.</p>
            <div style="text-align: center; margin: 2rem 0;">
              <div style="background: #0F3D21; color: #C4943A; font-size: 2.5rem; font-weight: 900; letter-spacing: 0.5rem; padding: 1.25rem 2rem; border-radius: 10px; display: inline-block; font-family: monospace;">
                ${code}
              </div>
            </div>
            <p style="color: #6B7280; font-size: 0.82rem;">If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.</p>
            <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 1.5rem 0;" />
            <p style="color: #9CA3AF; font-size: 0.72rem; text-align: center;">© ${new Date().getFullYear()} FORTIS OS™ · Operated by FORTIS INVICTA LTD · The Gambia 🇬🇲</p>
          </div>
        `,
      });
    } else {
      // Dev fallback: log code to console
      console.log(`[FORTIS OS] Password reset code for ${email}: ${code}`);
    }

    return successResponse;
  } catch (err) {
    console.error('forgot-password error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
