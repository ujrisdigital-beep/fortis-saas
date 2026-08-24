import { describe, expect, it } from "vitest";
import { embedLocally, extractPdfText, ocrImage } from "../../lib/govern/document-extract";
import { growNarrativeOptional, buildDeterministicGrowReport } from "../../lib/core/ai/grow-report";

describe("Wave C extractors", () => {
  it("fail closed when optional engines are absent", async () => {
    expect((await extractPdfText(new Uint8Array([1]))).ok).toBe(false);
    expect((await ocrImage(new Uint8Array([1]))).ok).toBe(false);
    expect((await embedLocally("hi")).ok).toBe(false);
  });
});

describe("Wave B Gemini narrative", () => {
  it("returns deterministic text when Gemini is unset", async () => {
    const base = buildDeterministicGrowReport({ businessOverview: "Shop with a sales process" }, []);
    const out = await growNarrativeOptional(base);
    expect(out.kind).toBe("deterministic");
    expect(out.fabricated).toBe(false);
  });
});
