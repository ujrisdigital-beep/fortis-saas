import { NextRequest, NextResponse } from "next/server";
import { requireApiAccess } from "@/lib/core/api-guard";
import { gradeAssessment, type SubmittedAnswer } from "@/lib/academy/assess";
import { bankForProgram } from "@/lib/academy/banks";

export async function POST(req: NextRequest) {
  const access = await requireApiAccess("training", "write");
  if (!access.ok) return access.response;
  try {
    const body = (await req.json()) as {
      programId?: string;
      answers?: SubmittedAnswer[];
      tabSwitches?: number;
      timeSpentSeconds?: number;
    };
    if (!body.programId || !body.answers) {
      return NextResponse.json({ error: "programId and answers are required" }, { status: 400 });
    }
    const graded = gradeAssessment(bankForProgram(body.programId), body.answers, {
      tabSwitches: body.tabSwitches ?? 0,
      timeSpentSeconds: body.timeSpentSeconds ?? 0,
    });
    return NextResponse.json({
      ...graded,
      userId: access.session.userId,
      programId: body.programId,
      message: graded.passed
        ? graded.flagged
          ? "Passed but flagged for human review. No certificate is issued automatically."
          : "Passed. Certificate issuance is a separate admin action."
        : `Scored ${graded.score}%. 70% required.`,
    });
  } catch (err) {
    console.error("assess error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
