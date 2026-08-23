const MISTRAL_API_BASE = "https://api.mistral.ai/v1";

function getMistralApiKey(): string {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    throw new Error("MISTRAL_API_KEY is not configured");
  }
  return apiKey;
}

interface MistralChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface MistralChatOptions {
  model?: string;
  temperature?: number;
}

// Chat completion via Mistral. Used for AI features other than issue
// categorization (which intentionally stays on OpenAI — see ai/client.ts).
export async function mistralChatCompletion(
  messages: MistralChatMessage[],
  options?: MistralChatOptions,
): Promise<string> {
  const apiKey = getMistralApiKey();
  const response = await fetch(`${MISTRAL_API_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: options?.model ?? "mistral-large-latest",
      temperature: options?.temperature,
      messages,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(
      `Mistral chat completion failed (${response.status}): ${errText}`,
    );
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return data.choices?.[0]?.message?.content ?? "";
}

// mistral-embed produces 1024-dimensional vectors (vs. OpenAI's 1536).
export async function mistralGenerateEmbeddings(
  texts: string[],
): Promise<number[][]> {
  const apiKey = getMistralApiKey();
  const response = await fetch(`${MISTRAL_API_BASE}/embeddings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "mistral-embed",
      input: texts,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(
      `Mistral embeddings request failed (${response.status}): ${errText}`,
    );
  }

  const data = (await response.json()) as { data: { embedding: number[] }[] };
  return data.data.map((d) => d.embedding);
}

export async function mistralGenerateEmbedding(
  text: string,
): Promise<number[]> {
  const [embedding] = await mistralGenerateEmbeddings([text]);
  return embedding ?? [];
}
