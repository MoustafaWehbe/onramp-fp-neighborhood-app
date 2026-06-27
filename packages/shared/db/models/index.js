"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = exports.Neighborhood = exports.RolePermission = exports.UserRole = exports.Permission = exports.Role = exports.RefreshToken = exports.Session = exports.User = void 0;
exports.initModels = initModels;
const User_1 = require("./User");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return User_1.User; } });
const Session_1 = require("./Session");
Object.defineProperty(exports, "Session", { enumerable: true, get: function () { return Session_1.Session; } });
const RefreshToken_1 = require("./RefreshToken");
Object.defineProperty(exports, "RefreshToken", { enumerable: true, get: function () { return RefreshToken_1.RefreshToken; } });
const Role_1 = require("./Role");
Object.defineProperty(exports, "Role", { enumerable: true, get: function () { return Role_1.Role; } });
const Permission_1 = require("./Permission");
Object.defineProperty(exports, "Permission", { enumerable: true, get: function () { return Permission_1.Permission; } });
const UserRole_1 = require("./UserRole");
Object.defineProperty(exports, "UserRole", { enumerable: true, get: function () { return UserRole_1.UserRole; } });
const RolePermission_1 = require("./RolePermission");
Object.defineProperty(exports, "RolePermission", { enumerable: true, get: function () { return RolePermission_1.RolePermission; } });
const Neighborhood_1 = require("./Neighborhood");
Object.defineProperty(exports, "Neighborhood", { enumerable: true, get: function () { return Neighborhood_1.Neighborhood; } });
const Category_1 = require("./Category");
Object.defineProperty(exports, "Category", { enumerable: true, get: function () { return Category_1.Category; } });
function initModels(sequelize) {
    User_1.User.initModel(sequelize);
    Session_1.Session.initModel(sequelize);
    RefreshToken_1.RefreshToken.initModel(sequelize);
    Role_1.Role.initModel(sequelize);
    Permission_1.Permission.initModel(sequelize);
    UserRole_1.UserRole.initModel(sequelize);
    RolePermission_1.RolePermission.initModel(sequelize);
    Neighborhood_1.Neighborhood.initModel(sequelize);
    Category_1.Category.initModel(sequelize);
    // Existing auth associations
    User_1.User.hasMany(Session_1.Session, { foreignKey: "userId", as: "sessions" });
    Session_1.Session.belongsTo(User_1.User, { foreignKey: "userId", as: "user" });
    User_1.User.hasMany(RefreshToken_1.RefreshToken, { foreignKey: "userId", as: "refreshTokens" });
    RefreshToken_1.RefreshToken.belongsTo(User_1.User, { foreignKey: "userId", as: "user" });
    Session_1.Session.hasMany(RefreshToken_1.RefreshToken, {
        foreignKey: "sessionId",
        as: "refreshTokens",
    });
    RefreshToken_1.RefreshToken.belongsTo(Session_1.Session, { foreignKey: "sessionId", as: "session" });
    // RBAC associations
    User_1.User.belongsToMany(Role_1.Role, {
        through: UserRole_1.UserRole,
        foreignKey: "userId",
        otherKey: "roleId",
        as: "roles",
    });
    Role_1.Role.belongsToMany(User_1.User, {
        through: UserRole_1.UserRole,
        foreignKey: "roleId",
        otherKey: "userId",
        as: "users",
    });
    Role_1.Role.belongsToMany(Permission_1.Permission, {
        through: RolePermission_1.RolePermission,
        foreignKey: "roleId",
        otherKey: "permissionId",
        as: "permissions",
    });
    Permission_1.Permission.belongsToMany(Role_1.Role, {
        through: RolePermission_1.RolePermission,
        foreignKey: "permissionId",
        otherKey: "roleId",
        as: "roles",
    });
}
//# sourceMappingURL=index.js.map