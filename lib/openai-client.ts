// lib/openai-client.ts
// ENTERPRISE-GRADE OPENAI CLIENT — Commercial Quality

import OpenAI from "openai";

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  model: "gpt-4o",
  temperature: 0.7,
  maxTokens: 4000,
  streamingMaxTokens: 4000,

  // Retry configuration
  maxRetries: 3,
  baseRetryDelay: 1000,
  maxRetryDelay: 10000,
  retryableStatuses: [429, 500, 502, 503, 504],

  // Rate limiting (client-side)
  maxRequestsPerMinute: 50,
  requestWindowMs: 60000,

  // Cost control
  monthlyBudgetUSD: Number(process.env.OPENAI_MONTHLY_BUDGET_USD ?? 500),
  budgetAlertThreshold: 0.8,

  // Timeouts
  requestTimeoutMs: 30000,
};

// ============================================
// USAGE TRACKING (Commercial Protection)
// ============================================

interface UsageStats {
  totalRequests: number;
  totalTokens: number;
  totalCostUSD: number;
  lastReset: Date;
  requestsThisMinute: number;
  lastRequestTime: number;
}

const usage: UsageStats = {
  totalRequests: 0,
  totalTokens: 0,
  totalCostUSD: 0,
  lastReset: new Date(),
  requestsThisMinute: 0,
  lastRequestTime: Date.now(),
};

// Cost per 1M tokens (GPT-4o)
const COST_PER_1M_INPUT_TOKENS = 2.50;
const COST_PER_1M_OUTPUT_TOKENS = 10.00;

function updateUsage(inputTokens: number, outputTokens: number) {
  const now = Date.now();

  if (now - usage.lastRequestTime > 60000) {
    usage.requestsThisMinute = 0;
    usage.lastRequestTime = now;
  }

  usage.totalRequests++;
  usage.requestsThisMinute++;
  usage.totalTokens += inputTokens + outputTokens;

  const inputCost = (inputTokens / 1_000_000) * COST_PER_1M_INPUT_TOKENS;
  const outputCost = (outputTokens / 1_000_000) * COST_PER_1M_OUTPUT_TOKENS;
  usage.totalCostUSD += inputCost + outputCost;

  if (usage.totalCostUSD >= CONFIG.monthlyBudgetUSD * CONFIG.budgetAlertThreshold) {
    console.warn(
      `⚠️ OpenAI budget alert: $${usage.totalCostUSD.toFixed(2)} used ` +
      `(${((usage.totalCostUSD / CONFIG.monthlyBudgetUSD) * 100).toFixed(0)}% of $${CONFIG.monthlyBudgetUSD} monthly budget)`
    );
  }

  if (usage.totalCostUSD >= CONFIG.monthlyBudgetUSD) {
    throw new Error(`Monthly budget of $${CONFIG.monthlyBudgetUSD} exceeded. Please contact support.`);
  }
}

export function getUsageStats() {
  return {
    totalRequests: usage.totalRequests,
    totalTokens: usage.totalTokens,
    totalCostUSD: usage.totalCostUSD,
    estimatedMonthlyProjection:
      (usage.totalCostUSD /
        Math.max(1, (Date.now() - usage.lastReset.getTime()) / (1000 * 60 * 60 * 24 * 30))) *
      30,
  };
}

export function resetUsageStats() {
  usage.totalRequests = 0;
  usage.totalTokens = 0;
  usage.totalCostUSD = 0;
  usage.lastReset = new Date();
  usage.requestsThisMinute = 0;
  usage.lastRequestTime = Date.now();
}

// ============================================
// CLIENT INITIALIZATION
// ============================================

let _client: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!_client) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY environment variable is not set.");
    _client = new OpenAI({
      apiKey,
      timeout: CONFIG.requestTimeoutMs,
      maxRetries: 0,
    });
  }
  return _client;
}

// ============================================
// RETRY LOGIC
// ============================================

async function withRetry<T>(fn: () => Promise<T>, context: string): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= CONFIG.maxRetries; attempt++) {
    try {
      if (usage.requestsThisMinute >= CONFIG.maxRequestsPerMinute) {
        const waitTime = 60000 - (Date.now() - usage.lastRequestTime);
        await new Promise(resolve => setTimeout(resolve, Math.max(0, waitTime)));
        usage.requestsThisMinute = 0;
        usage.lastRequestTime = Date.now();
      }

      return await fn();
    } catch (error: unknown) {
      lastError = error;

      const status = (error as { status?: number })?.status;
      const code = (error as { code?: string })?.code;
      const isRetryable = status !== undefined && CONFIG.retryableStatuses.includes(status);
      const isNetworkError = code === "ECONNRESET" || code === "ETIMEDOUT";

      if ((isRetryable || isNetworkError) && attempt < CONFIG.maxRetries) {
        const delay = Math.min(CONFIG.baseRetryDelay * Math.pow(2, attempt - 1), CONFIG.maxRetryDelay);
        console.warn(`[OpenAI] ${context} failed (attempt ${attempt}/${CONFIG.maxRetries}), retrying in ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      throw error;
    }
  }

  throw lastError ?? new Error(`Max retries exceeded for ${context}`);
}

// ============================================
// RESPONSE VALIDATION
// ============================================

interface ValidationResult {
  isValid: boolean;
  issues: string[];
  needsContinuation: boolean;
}

function validateUJUResponse(response: string, expectedMinLength = 2000): ValidationResult {
  const issues: string[] = [];

  if (response.length < expectedMinLength) {
    issues.push(`Response too short: ${response.length} chars (expected ${expectedMinLength}+)`);
  }

  const lastChar = response.slice(-1);
  const endsWithIncomplete = lastChar !== "." && lastChar !== "\n" && lastChar !== "!" && lastChar !== "?";
  const sections = response.split("## ");
  const lastSection = sections[sections.length - 1] ?? "";
  const hasIncompleteSection = response.includes("## ") && lastSection.length < 100;
  const needsContinuation = endsWithIncomplete || hasIncompleteSection;

  if (needsContinuation) issues.push("Response appears truncated");

  const requiredSections = ["## EXECUTIVE SUMMARY", "## MARKET CONTEXT", "## THE SINGLE MOST POWERFUL ACTION"];
  for (const section of requiredSections) {
    if (!response.includes(section)) issues.push(`Missing required section: ${section}`);
  }

  return { isValid: issues.length === 0, issues, needsContinuation };
}

// ============================================
// CONTINUATION HANDLER
// ============================================

async function requestContinuation(
  systemPrompt: string,
  previousResponse: string,
  messages: { role: "user" | "assistant"; content: string }[]
): Promise<string> {
  const continuationPrompt = `The previous response was cut off mid-generation. Please CONTINUE from where you left off.\n\nDO NOT repeat what you already wrote. Start exactly where you stopped.\n\nPrevious response (truncated):\n${previousResponse.slice(-1000)}\n\nContinue directly from the last sentence or section.`;

  const continuationMessages: { role: "user" | "assistant"; content: string }[] = [
    ...messages,
    { role: "assistant", content: previousResponse },
    { role: "user", content: continuationPrompt },
  ];

  return await runTextCompletion(systemPrompt, continuationMessages, CONFIG.maxTokens);
}

// ============================================
// MAIN TEXT COMPLETION
// ============================================

export async function runTextCompletion(
  systemPrompt: string,
  messages: { role: "user" | "assistant"; content: string }[],
  maxTokens = CONFIG.maxTokens
): Promise<string> {
  const client = getOpenAIClient();

  return await withRetry(async () => {
    const startTime = Date.now();

    const completion = await client.chat.completions.create({
      model: CONFIG.model,
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      temperature: CONFIG.temperature,
      max_tokens: maxTokens,
    });

    const duration = Date.now() - startTime;
    const response = completion.choices[0]?.message?.content ?? "";
    const usageData = completion.usage;

    if (usageData) updateUsage(usageData.prompt_tokens, usageData.completion_tokens);

    console.log(`[OpenAI] ${duration}ms, ${response.length} chars, ${usageData?.total_tokens ?? "?"} tokens`);

    const validation = validateUJUResponse(response);

    if (!validation.isValid) {
      console.warn(`[OpenAI] Validation issues: ${validation.issues.join(", ")}`);

      if (validation.needsContinuation && response.length > 500) {
        console.log("[OpenAI] Truncated response detected — requesting continuation...");
        try {
          const continuation = await requestContinuation(systemPrompt, response, messages);
          return response + "\n\n" + continuation;
        } catch (continuationError) {
          console.error("[OpenAI] Continuation failed:", continuationError);
        }
      }
    }

    return response;
  }, "runTextCompletion");
}

// ============================================
// STREAMING COMPLETION
// ============================================

export async function runStreamingCompletion(
  systemPrompt: string,
  messages: { role: "user" | "assistant"; content: string }[],
  onChunk: (chunk: string) => void,
  onComplete?: (fullResponse: string, usageData: { inputTokens: number; outputTokens: number }) => void
): Promise<string> {
  const client = getOpenAIClient();

  return await withRetry(async () => {
    const stream = await client.chat.completions.create({
      model: CONFIG.model,
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      temperature: CONFIG.temperature,
      max_tokens: CONFIG.streamingMaxTokens,
      stream: true,
    });

    let fullResponse = "";
    let outputTokens = 0;

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content ?? "";
      fullResponse += content;
      onChunk(content);
      outputTokens += Math.ceil(content.length / 4);
    }

    const fullPrompt = systemPrompt + messages.map(m => m.content).join("\n");
    const inputTokens = Math.ceil(fullPrompt.length / 4);

    updateUsage(inputTokens, outputTokens);
    onComplete?.(fullResponse, { inputTokens, outputTokens });

    return fullResponse;
  }, "runStreamingCompletion");
}

// ============================================
// JSON COMPLETION (Structured Data)
// ============================================

export async function runCompletion(systemPrompt: string, userMessage: string): Promise<unknown> {
  const client = getOpenAIClient();

  return await withRetry(async () => {
    const completion = await client.chat.completions.create({
      model: CONFIG.model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
      max_tokens: 1200,
    });

    const content = completion.choices[0]?.message?.content ?? "{}";
    const usageData = completion.usage;
    if (usageData) updateUsage(usageData.prompt_tokens, usageData.completion_tokens);

    return JSON.parse(content);
  }, "runCompletion");
}

// ============================================
// HEALTH CHECK
// ============================================

export async function checkOpenAIHealth(): Promise<{
  status: "healthy" | "degraded" | "unhealthy";
  latency: number;
  error?: string;
  usage?: ReturnType<typeof getUsageStats>;
}> {
  const start = Date.now();
  try {
    const client = getOpenAIClient();
    await client.chat.completions.create({
      model: CONFIG.model,
      messages: [{ role: "user", content: "Health check. Respond with OK." }],
      max_tokens: 10,
    });
    const latency = Date.now() - start;
    return { status: latency < 5000 ? "healthy" : "degraded", latency, usage: getUsageStats() };
  } catch (error: unknown) {
    return {
      status: "unhealthy",
      latency: Date.now() - start,
      error: (error as Error)?.message ?? "Unknown error",
      usage: getUsageStats(),
    };
  }
}

// ============================================
// ADMIN STATS
// ============================================

export async function getAdminStats() {
  return {
    usage: getUsageStats(),
    config: {
      model: CONFIG.model,
      monthlyBudgetUSD: CONFIG.monthlyBudgetUSD,
      budgetRemainingUSD: Math.max(0, CONFIG.monthlyBudgetUSD - usage.totalCostUSD),
      maxRetries: CONFIG.maxRetries,
    },
    health: await checkOpenAIHealth(),
  };
}
