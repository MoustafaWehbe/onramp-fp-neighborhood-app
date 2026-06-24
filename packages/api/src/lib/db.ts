import { Sequelize } from "sequelize";
import { initModels, User } from "@starter-kit/shared";
import { Issue } from "../models/Issue";
import { Comment } from "../models/Comment";

let sequelize: Sequelize | null = null;

export function getDatabase(): Sequelize {
  if (!sequelize) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL environment variable is required");

    sequelize = new Sequelize(url, {
      dialect: "postgres",
      logging: process.env.NODE_ENV === "development" ? console.info : false,
      define: { timestamps: true, underscored: true },
      pool: { max: 10, min: 2, acquire: 30_000, idle: 10_000 },
    });
  }
  return sequelize;
}

export async function initializeDatabase(): Promise<void> {
  const db = getDatabase();
  await db.authenticate();
  initModels(db);

  // Register app models
  Issue.initModel(db);
  Comment.initModel(db);

  // Issue associations
  User.hasMany(Issue, { foreignKey: "submittedById", as: "submittedIssues" });
  Issue.belongsTo(User, { foreignKey: "submittedById", as: "submittedBy" });

  User.hasMany(Issue, { foreignKey: "assignedToId", as: "assignedIssues" });
  Issue.belongsTo(User, { foreignKey: "assignedToId", as: "assignedTo" });

  // Comment associations
  Issue.hasMany(Comment, { foreignKey: "issueId", as: "comments" });
  Comment.belongsTo(Issue, { foreignKey: "issueId", as: "issue" });

  User.hasMany(Comment, { foreignKey: "authorId", as: "comments" });
  Comment.belongsTo(User, { foreignKey: "authorId", as: "author" });

  console.info("Database connection established");
}
