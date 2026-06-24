import type { Sequelize } from "sequelize";
import { User } from "./User";
import { Session } from "./Session";
import { RefreshToken } from "./RefreshToken";
import { Issue } from "./Issue";
import { ProgressLog } from "./ProgressLog";
export { User, Session, RefreshToken, Issue, ProgressLog };

export function initModels(sequelize: Sequelize): void {
  User.initModel(sequelize);
  Session.initModel(sequelize);
  RefreshToken.initModel(sequelize);
  Issue.initModel(sequelize);
  ProgressLog.initModel(sequelize);
  // Associations
  User.hasMany(Session, { foreignKey: "userId", as: "sessions" });
  Session.belongsTo(User, { foreignKey: "userId", as: "user" });

  User.hasMany(RefreshToken, { foreignKey: "userId", as: "refreshTokens" });
  RefreshToken.belongsTo(User, { foreignKey: "userId", as: "user" });

  Session.hasMany(RefreshToken, {
    foreignKey: "sessionId",
    as: "refreshTokens",
  });
  RefreshToken.belongsTo(Session, { foreignKey: "sessionId", as: "session" });
  Issue.hasMany(ProgressLog, { foreignKey: "issueId", as: "progressLogs" });
  ProgressLog.belongsTo(Issue, { foreignKey: "issueId", as: "issue" });
}
