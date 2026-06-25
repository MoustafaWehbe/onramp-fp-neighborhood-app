import { Issue } from "@starter-kit/shared";
import { ProgressLog } from "@starter-kit/shared";

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
    page?: number;
    limit?: number;
  }) {
    const { neighborhood, status, category, page = 1, limit = 20 } = filters;
    const where: Record<string, string> = {};
    if (neighborhood) where.neighborhood = neighborhood;
    if (status) where.status = status;
    if (category) where.category = category;

    const offset = (page - 1) * limit;

    const { rows, count } = await Issue.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      include: [{ model: ProgressLog, as: "progressLogs" }],
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
      ...data,
      status: "Reported",
    });
    return issue;
  },

  async updateStatus(
    issueId: string,
    newStatus: string,
    note: string,
    changedById: string,
  ) {
    const issue = await Issue.findByPk(issueId);
    if (!issue) return null;

    const currentIndex = VALID_STATUSES.indexOf(issue.status as Status);
    const newIndex = VALID_STATUSES.indexOf(newStatus as Status);

    if (!isValidTransition(issue.status as Status, newStatus)) {
      throw new Error(
        `Invalid status transition. Must go from ${issue.status} to ${getNextStatus(issue.status as Status)}`,
      );
    }

    const fromStatus = issue.status;
    issue.status = newStatus as Status;
    await issue.save();

    await ProgressLog.create({
      issueId,
      changedById,
      fromStatus,
      toStatus: newStatus,
      note,
    });

    return issue;
  },
};
