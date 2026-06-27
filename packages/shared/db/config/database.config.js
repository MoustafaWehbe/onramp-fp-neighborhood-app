"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSequelize = createSequelize;
exports.getSequelize = getSequelize;
const sequelize_1 = require("sequelize");
let sequelizeInstance = null;
function createSequelize(databaseUrl) {
    const url = databaseUrl ?? process.env.DATABASE_URL;
    if (!url) {
        throw new Error("DATABASE_URL is required");
    }
    return new sequelize_1.Sequelize(url, {
        dialect: "postgres",
        logging: process.env.NODE_ENV === "development" ? console.info : false,
        define: {
            timestamps: true,
            underscored: true,
        },
        pool: {
            max: 10,
            min: 2,
            acquire: 30_000,
            idle: 10_000,
        },
    });
}
function getSequelize() {
    if (!sequelizeInstance) {
        sequelizeInstance = createSequelize();
    }
    return sequelizeInstance;
}
//# sourceMappingURL=database.config.js.map