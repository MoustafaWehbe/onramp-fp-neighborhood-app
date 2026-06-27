"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Permission = void 0;
const sequelize_1 = require("sequelize");
class Permission extends sequelize_1.Model {
    static initModel(sequelize) {
        Permission.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
            },
            name: {
                type: sequelize_1.DataTypes.STRING(100),
                allowNull: false,
                unique: true,
            },
            description: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true,
            },
        }, {
            sequelize,
            tableName: "permissions",
            timestamps: true,
            underscored: true,
        });
        return Permission;
    }
}
exports.Permission = Permission;
//# sourceMappingURL=Permission.js.map