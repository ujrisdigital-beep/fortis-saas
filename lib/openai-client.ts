import OpenAI from "openai";

let _client: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!_client) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY environment variable is not set.");
    }
    _client = new OpenAI({ apiKey });
  }
  return _client;
}

/**
 * Run a GPT-4 chat completion with a system prompt + user message.
 * Returns the parsed JSON response, or throws on error.
 */
export async function runCompletion(
  systemPrompt: string,
  userMessage: string,
): Promise<unknown> {
  const client = getOpenAIClient();
  const completion = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    response_format: { type: "json_object" },
    temperature: 0.4,
    max_tokens: 1200,
  });

  const content = completion.choices[0]?.message?.content ?? "{}";
  return JSON.parse(content);
}
