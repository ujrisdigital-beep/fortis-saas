import { NextResponse } from "next/server";
import { publicProgrammes, sectors } from "@/lib/academy/programmes";

export async function GET() {
  return NextResponse.json({
    learnFree: true,
    paidAssessmentSku: "price_academy_assessment_gmd_v1",
    credentialKind: "hmac_registry",
    sectors: sectors(),
    programmes: publicProgrammes(),
  });
}
