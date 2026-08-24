import { describe, expect, it } from "vitest";
import { ACADEMY_PROGRAMMES, programmeById, publicProgrammes } from "../../lib/academy/programmes";
import { bankForProgram, publicQuestions } from "../../lib/academy/banks";
import { gradeAssessment } from "../../lib/academy/assess";

describe("vocational academy catalogue", () => {
  it("covers photography, media, marketing and youth trades", () => {
    const ids = ACADEMY_PROGRAMMES.map((p) => p.id);
    expect(ids).toEqual(
      expect.arrayContaining([
        "digital-literacy",
        "phone-photography",
        "digital-media",
        "graphic-basics",
        "digital-marketing",
        "web-fundamentals",
        "data-sheets",
        "customer-digital",
        "agritech-lite",
        "solar-basics",
        "entrepreneur-lite",
        "workplace-english-numeracy",
        "hospitality-ops",
        "agro-processing",
        "fisheries-postharvest",
        "construction-literacy",
        "device-repair",
        "bookkeeping-gra",
        "teamwork-problems",
        "fashion-digital",
        "women-digital",
        "remittances-family",
        "tourism-product-photo",
        "helpdesk-tester",
      ]),
    );
    expect(publicProgrammes().every((p) => p.sources.length > 0)).toBe(true);
  });

  it("ships CC BY-SA photography and media briefs longer than a tagline", () => {
    const photo = programmeById("phone-photography");
    const media = programmeById("digital-media");
    expect(photo?.lessons.every((l) => (l.body?.length ?? 0) > 400)).toBe(true);
    expect(media?.lessons.every((l) => (l.body?.length ?? 0) > 300)).toBe(true);
    expect(photo?.lessons[0].shareAlike).toMatch(/CC BY-SA/);
    expect(photo?.sources.some((s) => s.url.includes("wikibooks.org") && s.use === "adapt")).toBe(true);
  });

  it("labels Wave A/B tracks as workplace prep not national tickets", () => {
    const construction = programmeById("construction-literacy");
    const fish = programmeById("fisheries-postharvest");
    expect(construction?.summary).toMatch(/Not a NAQAA/i);
    expect(fish?.summary).toMatch(/Not a fishing/i);
    expect(bankForProgram("construction-literacy")[1].correctIndex).toBe(1);
  });

  it("does not treat Google Garage as remixable FORTIS content", () => {
    const g = programmeById("google-digital-marketing");
    expect(g?.status).toBe("external_link_only");
    expect(g?.lessons).toHaveLength(0);
  });

  it("grades photography from the server bank and never exposes keys", () => {
    const pub = publicQuestions("phone-photography");
    expect(pub.every((q) => !("correctIndex" in q))).toBe(true);
    const bank = bankForProgram("phone-photography");
    const result = gradeAssessment(
      bank,
      bank.map((q) => ({ questionId: q.id, selectedIndex: q.correctIndex })),
      { tabSwitches: 0, timeSpentSeconds: 90 },
    );
    expect(result.score).toBe(100);
    expect(result.eligibleForCertificate).toBe(true);
  });
});
