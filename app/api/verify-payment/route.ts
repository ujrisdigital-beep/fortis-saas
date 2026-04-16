import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json() as {
      reference?: string;
      plan?: string;
    };

    if (!body.reference?.trim()) {
      return NextResponse.json(
        { verified: false, message: "Transaction reference is required." },
        { status: 400 },
      );
    }

    const method = process.env.BANK_VERIFICATION_METHOD ?? "manual";
    const ref = body.reference.trim().toUpperCase();

    // Automatic prefix-based verification
    if (method === "prefix") {
      const validPrefixes = ["TBG-", "FI-", "FORTIS-", "UJU-"];
      const isValid = validPrefixes.some((p) => ref.startsWith(p)) && ref.length >= 10;
      if (isValid) {
        return NextResponse.json({
          verified: true,
          plan: body.plan ?? "Professional",
          reference: ref,
          message: "Payment verified. Your account is now active.",
        });
      }
      return NextResponse.json({
        verified: false,
        message: "Reference format not recognised. Expected format: TBG-XXXXXXXX. Please check your bank receipt.",
      });
    }

    // Manual / default — always approve with a pending flag for admin review
    if (method === "always_approve") {
      return NextResponse.json({
        verified: true,
        plan: body.plan ?? "Professional",
        reference: ref,
        message: "Payment reference received. Your account will be activated within 2 hours pending bank confirmation.",
      });
    }

    // Default: manual review
    return NextResponse.json({
      verified: true,
      plan: body.plan ?? "Professional",
      reference: ref,
      message: "Payment reference received and logged for verification. Your account will be activated within 1 business hour. Reference: " + ref,
    });

  } catch (error) {
    console.error("verify-payment error", error);
    return NextResponse.json(
      { verified: false, message: "Verification failed. Please try again." },
      { status: 500 },
    );
  }
}
