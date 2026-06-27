"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Neighborhood = void 0;
const sequelize_1 = require("sequelize");
class Neighborhood extends sequelize_1.Model {
    static initModel(sequelize) {
        Neighborhood.init({
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
            city: {
                type: sequelize_1.DataTypes.STRING(120),
                allowNull: false,
            },
            createdAt: sequelize_1.DataTypes.DATE,
            updatedAt: sequelize_1.DataTypes.DATE,
        }, {
            sequelize,
            tableName: "neighborhoods",
            timestamps: true,
            underscored: true,
        });
        return Neighborhood;
    }
}
exports.Neighborhood = Neighborhood;
//# sourceMappingURL=Neighborhood.js.map