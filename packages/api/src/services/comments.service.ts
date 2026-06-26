import { Comment } from "@starter-kit/shared";
import { Issue } from "@starter-kit/shared";

export const commentsService = {
  async getByIssueId(issueId: string) {
    const comments = await Comment.findAll({
      where: { issueId },
      order: [["createdAt", "ASC"]],
    });
    return comments;
  },

  async create(data: {
    issueId: string;
    authorId: string;
    body: string;
    requestingUserId: string;
    requestingUserRole: string;
  }) {
    const { issueId, authorId, body, requestingUserId, requestingUserRole } =
      data;

    // find the issue first
    const issue = await Issue.findByPk(issueId);
    if (!issue) throw new Error("Issue not found");

    // residents can only comment on their own issues
    if (
      requestingUserRole === "user" &&
      issue.reportedById !== requestingUserId
    ) {
      throw new Error("Residents can only comment on their own issues");
    }

    const comment = await Comment.create({ issueId, authorId, body });
    return comment;
  },
};
