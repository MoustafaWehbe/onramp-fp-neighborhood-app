"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const sequelize_1 = require("sequelize");
class Category extends sequelize_1.Model {
    static initModel(sequelize) {
        Category.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
            },
            name: {
                type: sequelize_1.DataTypes.STRING(120),
                allowNull: false,
            },
            slug: {
                type: sequelize_1.DataTypes.STRING(140),
                allowNull: false,
                unique: true,
            },
            description: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true,
            },
            department: {
                type: sequelize_1.DataTypes.STRING(120),
                allowNull: true,
            },
            embedding: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: true,
            },
            createdAt: sequelize_1.DataTypes.DATE,
            updatedAt: sequelize_1.DataTypes.DATE,
        }, {
            sequelize,
            tableName: "categories",
            timestamps: true,
            underscored: true,
        });
        return Category;
    }
}
exports.Category = Category;
//# sourceMappingURL=Category.js.map