"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshToken = void 0;
const sequelize_1 = require("sequelize");
class RefreshToken extends sequelize_1.Model {
    get isExpired() {
        return new Date() > this.expiresAt;
    }
    get isRevoked() {
        return this.revokedAt != null;
    }
    get isValid() {
        return !this.isExpired && !this.isRevoked;
    }
    static initModel(sequelize) {
        RefreshToken.init({
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
            sessionId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                references: { model: "sessions", key: "id" },
                onDelete: "CASCADE",
            },
            tokenHash: {
                type: sequelize_1.DataTypes.STRING(64),
                allowNull: false,
                unique: true,
            },
            expiresAt: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            revokedAt: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
        }, {
            sequelize,
            tableName: "refresh_tokens",
            timestamps: true,
            underscored: true,
        });
        return RefreshToken;
    }
}
exports.RefreshToken = RefreshToken;
//# sourceMappingURL=RefreshToken.js.map