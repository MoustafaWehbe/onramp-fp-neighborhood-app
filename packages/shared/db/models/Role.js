"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
const sequelize_1 = require("sequelize");
class Role extends sequelize_1.Model {
    static initModel(sequelize) {
        Role.init({
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
            tableName: "roles",
            timestamps: true,
            underscored: true,
        });
        return Role;
    }
}
exports.Role = Role;
//# sourceMappingURL=Role.js.map