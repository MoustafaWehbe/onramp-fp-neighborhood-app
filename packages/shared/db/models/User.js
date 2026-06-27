"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
class User extends sequelize_1.Model {
    static initModel(sequelize) {
        User.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
            },
            email: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: { isEmail: true },
            },
            passwordHash: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            name: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false,
            },
            googleId: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
                field: "google_id",
            },
            emailVerified: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false,
            },
        }, {
            sequelize,
            tableName: "users",
            timestamps: true,
            underscored: true,
        });
        return User;
    }
}
exports.User = User;
//# sourceMappingURL=User.js.map