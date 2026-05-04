import { NextResponse } from "next/server";
import {
  runForensicAnalysis,
  getCaseStrengthScore,
  getAlertsByCategory,
  type ForensicContext,
  type ForensicPattern,
} from "@/lib/ujris/forensic-patterns";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const ctx: ForensicContext = {
      documents: body.documents || [],
      timeline: body.timeline || [],
      communications: body.communications || [],
      employmentTerms: body.employmentTerms,
      evidenceItems: body.evidenceItems || [],
      witnessStatements: body.witnessStatements || [],
      financialRecords: body.financialRecords || [],
      emails: body.emails || [],
      letters: body.letters || [],
      incidents: body.incidents || [],
    };

    const detected = runForensicAnalysis(ctx);
    const alerts = detected.map((p) => {
      const result = p.detect(ctx);
      return {
        ruleId: p.id,
        category: p.category,
        label: p.label,
        description: p.description,
        severity: result.severity || "low",
        explanation: result.explanation,
        counterAction: result.counterAction,
      };
    });

    const alertsByCategory = getAlertsByCategory(ctx);
    const categorySummary = Object.entries(alertsByCategory).map(([cat, patterns]) => ({
      category: cat,
      count: patterns.length,
      patterns: patterns.map((p) => p.label),
    }));

    const caseStrength = getCaseStrengthScore(ctx);

    return NextResponse.json({
      alerts,
      alertCount: alerts.length,
      caseStrength,
      categorySummary,
      recommendation: caseStrength >= 60
        ? "Strong case. Proceed to Industrial Court."
        : caseStrength >= 30
        ? "Moderate case. Gather additional evidence before filing."
        : "Weak case indicators. Consult legal counsel before proceeding.",
    });
  } catch (e) {
    return NextResponse.json({ error: "Analysis failed", detail: String(e) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    engine: "FORTIS FORENSIC PATTERNS",
    version: "1.0",
    rules: 37,
    categories: [
      { code: "ET", name: "Evidential Tricks", count: 8 },
      { code: "PT", name: "Procedural Traps", count: 6 },
      { code: "ST", name: "Solicitor Tactics", count: 5 },
      { code: "PPT", name: "Police/PSD Tactics", count: 6 },
      { code: "FA", name: "Forensic Audit", count: 5 },
      { code: "CS", name: "Counter-Strategies", count: 7 },
    ],
  });
}