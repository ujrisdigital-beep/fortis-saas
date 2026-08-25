import { describe, expect, it } from "vitest";
import { geminiConfigured } from "../../lib/ai/gemini-optional";
import { runCompletion } from "../../lib/openai-client";

describe("Google-first AI stack", () => {
  it("does not require OpenAI or Gemini to boot", () => {
    expect(geminiConfigured()).toBe(false);
  });

  it("refuses paid completion when no Gemini key is set", async () => {
    await expect(runCompletion("sys", "user")).rejects.toThrow("no_paid_ai_configured");
  });
});
