"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = void 0;
const sequelize_1 = require("sequelize");
class UserRole extends sequelize_1.Model {
    static initModel(sequelize) {
        UserRole.init({
            userId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                primaryKey: true,
            },
            roleId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                primaryKey: true,
            },
            assignedBy: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: true,
            },
            assignedAt: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.NOW,
            },
        }, {
            sequelize,
            tableName: "user_roles",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: false,
            underscored: true,
        });
        return UserRole;
    }
}
exports.UserRole = UserRole;
//# sourceMappingURL=UserRole.js.map