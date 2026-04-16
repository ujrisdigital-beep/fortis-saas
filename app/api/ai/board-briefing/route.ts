import { boardAlerts, boardMetrics, projectHeatMap } from "../../../../data/board-dashboard";

const encoder = new TextEncoder();

function send(chunk: string) {
  return encoder.encode(`data: ${JSON.stringify({ chunk })}\n\n`);
}

export async function POST() {
  const lines = [
    "Top 5 next actions for CEO Cadjatu Djalo:\n\n",
    `1. Finalise AfDB and EU-ACP submission package. Reasoning: current grant pipeline is the fastest route to non-dilutive capital. Urgency: high. Expected outcome: immediate funding momentum. Risk if delayed: lost grant cycle.\n\n`,
    `2. Lock the Fortis Command Centre sponsor shortlist across Ecobank, Trust Bank, and GTBank. Reasoning: command-centre readiness unlocks execution credibility. Urgency: high. Expected outcome: operational base and sponsor visibility. Risk if delayed: investor hesitation.\n\n`,
    `3. Escalate the Investor Roadshow project from critical to active delivery. Reasoning: board data shows this is under-progressed. Urgency: high. Expected outcome: stronger investor meeting conversion. Risk if delayed: capital gap widens.\n\n`,
    `4. Accelerate Smart Battery Pack pilot readiness. Reasoning: energy is the earliest revenue engine in the portfolio. Urgency: medium. Expected outcome: proof of cash-generating operations. Risk if delayed: slower market proof.\n\n`,
    `5. Formalise MOU renewals and partner reporting cadence. Reasoning: partner confidence depends on structured governance. Urgency: medium. Expected outcome: tighter stakeholder retention. Risk if delayed: collaboration drift.\n\n`,
    `Metrics reviewed: ${boardMetrics.length} KPIs, ${projectHeatMap.length} active project lines, ${boardAlerts.length} alerts.`,
  ];

  const stream = new ReadableStream({
    start(controller) {
      for (const line of lines) {
        controller.enqueue(send(line));
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
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
}
