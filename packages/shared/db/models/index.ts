import type { Sequelize } from "sequelize";

import { User } from "./User";
import { Session } from "./Session";
import { RefreshToken } from "./RefreshToken";
import { Role } from "./Role";
import { Permission } from "./Permission";
import { UserRole } from "./UserRole";
import { RolePermission } from "./RolePermission";
import { Neighborhood } from "./Neighborhood";
import { Category } from "./Category";
import { Issue } from "./Issue";
import { ProgressLog } from "./ProgressLog";
import { Comment } from "./Comment";

export {
  User,
  Session,
  RefreshToken,
  Role,
  Permission,
  UserRole,
  RolePermission,
  Neighborhood,
  Category,
  Issue,
  ProgressLog,
  Comment,
};

export function initModels(sequelize: Sequelize): void {
  User.initModel(sequelize);
  Session.initModel(sequelize);
  RefreshToken.initModel(sequelize);
  Role.initModel(sequelize);
  Permission.initModel(sequelize);
  UserRole.initModel(sequelize);
  RolePermission.initModel(sequelize);
  Neighborhood.initModel(sequelize);
  Category.initModel(sequelize);
  Issue.initModel(sequelize);
  ProgressLog.initModel(sequelize);
  Comment.initModel(sequelize);

  // Auth associations
  User.hasMany(Session, { foreignKey: "userId", as: "sessions" });
  Session.belongsTo(User, { foreignKey: "userId", as: "user" });

  User.hasMany(RefreshToken, { foreignKey: "userId", as: "refreshTokens" });
  RefreshToken.belongsTo(User, { foreignKey: "userId", as: "user" });

  Session.hasMany(RefreshToken, {
    foreignKey: "sessionId",
    as: "refreshTokens",
  });
  RefreshToken.belongsTo(Session, { foreignKey: "sessionId", as: "session" });

  // RBAC associations
  User.belongsToMany(Role, {
    through: UserRole,
    foreignKey: "userId",
    otherKey: "roleId",
    as: "roles",
  });

  Role.belongsToMany(User, {
    through: UserRole,
    foreignKey: "roleId",
    otherKey: "userId",
    as: "users",
  });

  Role.belongsToMany(Permission, {
    through: RolePermission,
    foreignKey: "roleId",
    otherKey: "permissionId",
    as: "permissions",
  });

  Permission.belongsToMany(Role, {
    through: RolePermission,
    foreignKey: "permissionId",
    otherKey: "roleId",
    as: "roles",
  });

  // Issue associations
  Issue.hasMany(ProgressLog, { foreignKey: "issueId", as: "progressLogs" });
  ProgressLog.belongsTo(Issue, { foreignKey: "issueId", as: "issue" });

  Issue.hasMany(Comment, { foreignKey: "issueId", as: "comments" });
  Comment.belongsTo(Issue, { foreignKey: "issueId", as: "issue" });
}