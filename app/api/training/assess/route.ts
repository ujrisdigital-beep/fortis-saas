import { NextRequest, NextResponse } from "next/server";
import { requireApiAccess } from "@/lib/core/api-guard";
import { gradeAssessment, type SubmittedAnswer } from "@/lib/academy/assess";
import { bankForProgram } from "@/lib/academy/banks";
import { canUseFeature } from "@/lib/core/entitlements";
import { listGrants } from "@/lib/entitlements/store";

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
    const paid = canUseFeature(
      listGrants(access.session.organisationId),
      access.session.organisationId,
      "academy.assessment",
    );
    return NextResponse.json({
      ...graded,
      eligibleForCertificate: graded.eligibleForCertificate && paid,
      paidAttempt: paid,
      userId: access.session.userId,
      programId: body.programId,
      message: graded.passed
        ? graded.flagged
          ? "Passed but flagged for human review. No certificate is issued automatically."
          : paid
            ? "Passed. Certificate issuance is a separate admin action."
            : "Passed the free paper. Transfer-pay an assessment attempt to become certificate-eligible."
        : `Scored ${graded.score}%. 70% required.`,
    });
  } catch (err) {
    console.error("assess error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
