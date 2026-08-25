import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    available: false,
    bankUse: "not_authorised",
    reason: "No validated, consented score model is in production.",
  });
}

export async function POST() {
  return NextResponse.json(
    {
      error: "credit_model_not_authorised",
      code: "MODULE_NOT_PRODUCTION_READY",
      bankUse: "not_authorised",
    },
    { status: 503 },
  );
}
