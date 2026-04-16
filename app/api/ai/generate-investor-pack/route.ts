import { FORTIS } from "../../../../lib/constants";

const encoder = new TextEncoder();

function send(chunk: string) {
  return encoder.encode(`data: ${JSON.stringify({ chunk })}\n\n`);
}

export async function POST() {
  const sections = [
    `## Executive Summary\n${FORTIS.name} is building an integrated circular economy platform in The Gambia to replace more than $200M in annual imports with local alternatives.\n\n`,
    `## The Gambia Opportunity\nSmall market, high structural inefficiency, and major white space in energy, agriculture, housing, and SME digitisation create outsized upside for first movers.\n\n`,
    `## Business Model\nFortis operates across energy tech, agriculture, housing, fintech, SaaS, waste systems, health, and tourism - with shared infrastructure and cross-selling economics.\n\n`,
    `## Traction & Milestones\nActive technical relationships include MannerInsect Finland and BugFactory BFB Egypt. Funding pipeline is active across AfDB, GCF, IFAD, and EU-linked opportunities.\n\n`,
    `## Revenue Model & Projections\nShort-term revenue begins with Smart Battery Pack rentals, SME subscriptions, and implementation services. Medium-term growth scales through partner programs and infrastructure deployments.\n\n`,
    `## Team\nCEO: ${FORTIS.ceo}. Board and Regulatory Lead: ${FORTIS.boardReg}. Headquarters: ${FORTIS.address}. Banking anchor: ${FORTIS.bank}.\n\n`,
    `## Use of Investment\nCapital is allocated to energy rollout, bug factory pilot, command-centre operations, AI platform build, and business development.\n\n`,
    `## ESG & Impact\nImpact metrics include energy access, jobs, SME growth, reduced import dependence, and circular waste conversion.\n\n`,
    `## Ask\nCurrent partner capital target ranges from $50K angel participation to $2M strategic institutional engagement, with structured and blended options available.`,
  ];

  const stream = new ReadableStream({
    start(controller) {
      for (const section of sections) {
        controller.enqueue(send(section));
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
