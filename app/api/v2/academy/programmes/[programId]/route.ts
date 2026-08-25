import { NextResponse } from "next/server";
import { programmeById } from "@/lib/academy/programmes";
import { publicQuestions } from "@/lib/academy/banks";

export async function GET(_req: Request, ctx: { params: { programId: string } }) {
  const programme = programmeById(ctx.params.programId);
  if (!programme) {
    return NextResponse.json({ error: "unknown_programme", code: "NOT_FOUND" }, { status: 404 });
  }
  return NextResponse.json({
    programme,
    questions: programme.status === "external_link_only" ? [] : publicQuestions(programme.assessmentProgramId),
  });
}
