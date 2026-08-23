import type { Job } from "bullmq";
import type {
  EmbeddingsJobData,
  EmbeddingsJobResult,
} from "@starter-kit/shared";
import { generateEmbedding } from "../lib/ai";
import { Issue } from "@starter-kit/shared";

export async function processEmbeddingsJob(
  job: Job<EmbeddingsJobData, EmbeddingsJobResult>,
): Promise<EmbeddingsJobResult> {
  const { entityId, entityType, text } = job.data;

  console.info(
    `[embeddings] Generating embedding for ${entityType}:${entityId}`,
  );

  const embedding = await generateEmbedding(text);

  if (entityType === "issue") {
    const vectorStr = `[${embedding.join(",")}]`;
    await Issue.sequelize!.query(
      `UPDATE issues SET embedding = :embedding::vector WHERE id = :id`,
      {
        replacements: {
          embedding: vectorStr,
          id: entityId,
        },
      },
    );
  }

  console.info(
    `[embeddings] Generated ${embedding.length}-dim vector for ${entityType}:${entityId}`,
  );

  return { dimensions: embedding.length };
}
