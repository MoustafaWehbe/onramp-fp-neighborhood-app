import { Sequelize } from "sequelize";
import * as pgvector from "pgvector/sequelize";

// Teaches Sequelize how to read/write Postgres `vector` columns
// (adds DataTypes.VECTOR). Must run before any model calling
// `DataTypes.VECTOR(...)` is initialized.
pgvector.registerType(Sequelize);

let sequelizeInstance: Sequelize | null = null;

export function createSequelize(databaseUrl?: string): Sequelize {
  const url = databaseUrl ?? process.env.DATABASE_URL;

  if (!url) {
    throw new Error("DATABASE_URL is required");
  }

  return new Sequelize(url, {
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

export function getSequelize(): Sequelize {
  if (!sequelizeInstance) {
    sequelizeInstance = createSequelize();
  }
  return sequelizeInstance;
}
