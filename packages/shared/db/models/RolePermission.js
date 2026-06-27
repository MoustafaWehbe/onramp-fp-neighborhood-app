"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolePermission = void 0;
const sequelize_1 = require("sequelize");
class RolePermission extends sequelize_1.Model {
    static initModel(sequelize) {
        RolePermission.init({
            roleId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                primaryKey: true,
            },
            permissionId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                primaryKey: true,
            },
        }, {
            sequelize,
            tableName: "role_permissions",
            timestamps: false,
            underscored: true,
        });
        return RolePermission;
    }
}
exports.RolePermission = RolePermission;
//# sourceMappingURL=RolePermission.js.map