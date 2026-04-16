import { NextResponse } from "next/server";
import { grantsDatabase } from "../../../../data/grants-database";
import { FORTIS } from "../../../../lib/constants";

const encoder = new TextEncoder();

function chunk(text: string) {
  return encoder.encode(`data: ${JSON.stringify({ chunk: text })}\n\n`);
}

function done() {
  return encoder.encode("data: [DONE]\n\n");
}

function buildDraft(grantTitle: string, projectDescription: string, budgetOutline: string) {
  return [
    `## Executive Summary\nFortis Invicta submits this proposal to ${grantTitle} to accelerate climate-aligned circular economy delivery in The Gambia.`,
    `## Organisation Background\n${FORTIS.name} (Reg ${FORTIS.reg}) is headquartered in ${FORTIS.address}. Leadership: CEO ${FORTIS.ceo}, Board/Regulatory ${FORTIS.boardReg}.`,
    `## Project Description and Theory of Change\n${projectDescription}\n\nBy integrating energy, agriculture, and SME digital systems, Fortis closes import dependency through local production and efficient distribution.`,
    `## Target Beneficiaries and Impact\nPrimary beneficiaries include SMEs, farmers, youth job seekers, and energy-poor households across Gambian regions.`,
    `## Methodology and Work Packages\nWP1: Mobilisation and baseline\nWP2: Pilot implementation\nWP3: Scale and partner onboarding\nWP4: Monitoring and performance optimisation`,
    `## Budget Breakdown (GMD + USD)\n${budgetOutline}\n\nAll costs are managed in GMD with monthly USD equivalents for donor reporting.`,
    `## Gantt Chart (12 months)\nMonth 1-2: Setup and procurement\nMonth 3-5: Pilot launch\nMonth 6-9: Expansion\nMonth 10-12: Consolidation and audit`,
    `## Monitoring and Evaluation\nKPIs: energy units deployed, SMEs onboarded, cost savings vs imports, job creation, emissions reduction proxy.`,
    `## Risk Register\n1) Supply chain delays -> dual sourcing\n2) FX volatility -> staged procurement\n3) Regulatory delay -> early ministry coordination\n4) Adoption risk -> local agent model\n5) Funding delay -> phased execution sequencing`,
    `## Team and Governance\nExecutive sponsor: ${FORTIS.ceo}. Regulatory oversight: ${FORTIS.boardReg}. Governance cadence: weekly PMO and monthly board review.`,
    "## Sustainability Plan\nRevenue from energy rentals, platform subscriptions, and service contracts sustains operations beyond grant horizon.",
  ].join("\n\n");
}

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as {
      grantId: string;
      projectDescription: string;
      budgetOutline: string;
    };

    if (!payload.grantId || !payload.projectDescription || !payload.budgetOutline) {
      return NextResponse.json({ error: "grantId, projectDescription, and budgetOutline are required." }, { status: 400 });
    }

    const grant = grantsDatabase.find((item) => item.id === payload.grantId);
    if (!grant) {
      return NextResponse.json({ error: "Grant not found." }, { status: 404 });
    }

    const draft = buildDraft(grant.title, payload.projectDescription, payload.budgetOutline);
    const parts = draft.split("\n\n");

    const stream = new ReadableStream({
      start(controller) {
        for (const part of parts) {
          controller.enqueue(chunk(`${part}\n\n`));
        }
        controller.enqueue(done());
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("generate-grant-application error", error);
    return NextResponse.json({ error: "Failed to generate application." }, { status: 500 });
  }
}
