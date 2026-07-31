import { Op } from "sequelize";
import { Issue } from "@starter-kit/shared";
import { ProgressLog } from "@starter-kit/shared";
import { chatCompletion, generateEmbedding } from "../lib/ai";
import { embeddingsQueue } from "@starter-kit/shared";
export const VALID_STATUSES = [
  "Reported",
  "Acknowledged",
  "In Progress",
  "Resolved",
] as const;

export type Status = (typeof VALID_STATUSES)[number];

export function getNextStatus(current: Status): Status | null {
  const index = VALID_STATUSES.indexOf(current);
  return index < VALID_STATUSES.length - 1 ? VALID_STATUSES[index + 1] : null;
}
export function isValidTransition(from: Status, to: string): boolean {
  const currentIndex = VALID_STATUSES.indexOf(from);
  const newIndex = VALID_STATUSES.indexOf(to as Status);
  return newIndex !== -1 && newIndex === currentIndex + 1;
}
export const issuesService = {
  async getAll(filters: {
    neighborhood?: string;
    status?: string;
    category?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }) {
    const {
      neighborhood,
      status,
      category,
      dateFrom,
      dateTo,
      page = 1,
      limit = 20,
    } = filters;
    const where: Record<string, unknown> = {};
    if (neighborhood) where.neighborhood = neighborhood;
    if (status) where.status = status;
    if (category) where.category = category;

    if (dateFrom || dateTo) {
      const createdAt: Record<symbol, Date> = {};
      if (dateFrom) createdAt[Op.gte] = new Date(dateFrom);
      if (dateTo) {
        // include the entire end day
        const end = new Date(dateTo);
        end.setHours(23, 59, 59, 999);
        createdAt[Op.lte] = end;
      }
      where.createdAt = createdAt;
    }

    const offset = (page - 1) * limit;

    const { rows, count } = await Issue.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      include: [{ model: ProgressLog, as: "progressLogs" }],
      distinct: true,
    }); //limit and offset handle pagination — if there are 100 issues and you want page 2 with 20 per page, offset = 20 means "skip the first 20."

    return { issues: rows, total: count, page, limit };
  },

  async getById(id: string) {
    const issue = await Issue.findByPk(id, {
      //find by primary key
      include: [{ model: ProgressLog, as: "progressLogs" }], //It tells Sequelize when you fetch an issue, also fetch all its progress logs in the same query.
    });
    return issue;
  },

  async create(data: {
    title: string;
    description: string;
    category: string;
    neighborhood: string;
    address: string;
    reportedById: string;
    aiRoutingNote?: string;
  }) {
    const issue = await Issue.create({
      title: data.title,
      description: data.description,
      category: data.category,
      neighborhood: data.neighborhood,
      address: data.address,
      reportedById: data.reportedById,
      aiRoutingNote: data.aiRoutingNote,
      status: "Reported",
    });
    // queue embedding generation via BullMQ
    if (embeddingsQueue) {
      await embeddingsQueue.add("generate-embedding", {
        entityId: issue.id,
        entityType: "issue",
        text: `${issue.title} ${issue.description}`,
      });
    }
    return issue;
  },

  async search(query: string, limit = 10) {
    const queryEmbedding = await generateEmbedding(query);

    const results = await Issue.sequelize!.query(
      `SELECT id, title, description, category, neighborhood, 
          address, status, reported_by_id as "reportedById", 
          ai_routing_note as "aiRoutingNote",
          created_at as "createdAt", updated_at as "updatedAt",
          1 - (embedding <=> :embedding::vector) AS similarity
   FROM issues
   WHERE embedding IS NOT NULL
   ORDER BY embedding <=> :embedding::vector
   LIMIT :limit`,
      {
        replacements: {
          embedding: `[${queryEmbedding.join(",")}]`,
          limit,
        },
        type: "SELECT" as any,
      },
    );

    return results;
  },

  async updateStatus(
    issueId: string,
    newStatus: string,
    note: string,
    changedById: string,
  ) {
    return Issue.sequelize!.transaction(async (transaction) => {
      const issue = await Issue.findByPk(issueId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      if (!issue) return null;

      if (!isValidTransition(issue.status as Status, newStatus)) {
        throw new Error(
          `Invalid status transition. Must go from ${issue.status} to ${getNextStatus(issue.status as Status)}`,
        );
      }

      const fromStatus = issue.status;
      issue.status = newStatus as Status;
      await issue.save({ transaction });

      await ProgressLog.create(
        {
          issueId,
          changedById,
          fromStatus,
          toStatus: newStatus,
          note,
        },
        { transaction },
      );

      return issue;
    });
  },

  async categorize(description: string, categories: string[]) {
    const prompt = `You are a municipal issue classifier for a community platform.
A resident has submitted the following issue description:

"${description}"

Available categories: ${categories.join(", ")}

Return ONLY a valid JSON object with exactly these two fields:
{
  "suggestedCategory": "<one of the available categories above>",
  "routingNote": "<one short, polite sentence explaining which city department handles this>"
}

Do not include any explanation, markdown, or extra text. JSON only.`;

    const response = await chatCompletion([{ role: "user", content: prompt }]);

    try {
      const parsed = JSON.parse(response);
      return {
        suggestedCategory: parsed.suggestedCategory,
        routingNote: parsed.routingNote,
      };
    } catch {
      return {
        suggestedCategory: categories[0],
        routingNote:
          "This issue has been routed to the appropriate department.",
      };
    }
  },
};
