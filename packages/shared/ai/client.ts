import OpenAI from "openai";

let openaiClient: OpenAI | null = null;

export function getAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not configured");
    }
    openaiClient = new OpenAI({ 
      apiKey,
      baseURL: process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1"
    });
  }
  return openaiClient;
}

export async function chatCompletion(
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
  options?: Partial<OpenAI.Chat.ChatCompletionCreateParamsNonStreaming>,
): Promise<string> {
  const client = getAIClient();
  const response = await client.chat.completions.create({
    model: options?.model ?? "meta/llama-3.1-8b-instruct",
    messages,
    ...options,
  });
  return response.choices[0]?.message?.content ?? "";
}