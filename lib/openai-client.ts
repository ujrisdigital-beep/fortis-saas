/**
 * Compatibility facade. Paid OpenAI is no longer a required dependency.
 * Order: optional Gemini (AI Studio) → caller must fall back to deterministic rules.
 */
import { geminiComplete, geminiConfigured } from "./ai/gemini-optional";

export async function runCompletion(systemPrompt: string, userMessage: string): Promise<unknown> {
  if (!geminiConfigured()) {
    throw new Error("no_paid_ai_configured");
  }
  const text = await geminiComplete(systemPrompt, userMessage);
  try {
    return JSON.parse(text);
  } catch {
    return { text };
  }
}

export async function runTextCompletion(
  systemPrompt: string,
  messages: { role: "user" | "assistant"; content: string }[],
): Promise<string> {
  if (!geminiConfigured()) {
    throw new Error("no_paid_ai_configured");
  }
  const user = messages.map((m) => `${m.role}: ${m.content}`).join("\n");
  return geminiComplete(systemPrompt, user);
}

export async function getAdminStats() {
  return {
    provider: geminiConfigured() ? "gemini" : "deterministic_only",
    openaiRequired: false,
    usage: { totalRequests: 0, totalTokens: 0, totalCostUSD: 0 },
    config: { model: process.env.GEMINI_MODEL ?? "gemini-2.0-flash", monthlyBudgetUSD: 0 },
  };
}

export function getUsageStats() {
  return { totalRequests: 0, totalTokens: 0, totalCostUSD: 0 };
}

export function resetUsageStats() {}
