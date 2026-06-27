"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
const sequelize_1 = require("sequelize");
class Session extends sequelize_1.Model {
    static initModel(sequelize) {
        Session.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
            },
            userId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                references: { model: "users", key: "id" },
                onDelete: "CASCADE",
            },
            userAgent: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true,
            },
            ipAddress: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: true,
            },
            expiresAt: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
        }, {
            sequelize,
            tableName: "sessions",
            timestamps: true,
            underscored: true,
        });
        return Session;
    }
}
exports.Session = Session;
//# sourceMappingURL=Session.js.map