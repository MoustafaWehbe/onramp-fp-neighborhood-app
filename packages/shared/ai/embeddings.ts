import { mistralGenerateEmbedding, mistralGenerateEmbeddings } from "./mistral-client";

// Embeddings now run through Mistral (mistral-embed, 1024 dimensions)
// instead of OpenAI. Callers are unchanged — only the provider moved.
export async function generateEmbedding(text: string): Promise<number[]> {
  return mistralGenerateEmbedding(text);
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  return mistralGenerateEmbeddings(texts);
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length)
    throw new Error("Vectors must have the same length");
  const dot = a.reduce((sum, ai, i) => sum + ai * (b[i] ?? 0), 0);
  const magA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const magB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
}
