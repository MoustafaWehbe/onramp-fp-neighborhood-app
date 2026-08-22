"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      "CREATE EXTENSION IF NOT EXISTS vector;",
    );
    await queryInterface.sequelize.query(
      "ALTER TABLE issues ADD COLUMN IF NOT EXISTS embedding vector(1024);",
    ); // Mistral's mistral-embed model produces 1024-dimensional embeddings — each issue's title + description gets converted into a list of 1024 numbers that represent its meaning mathematically
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      "ALTER TABLE issues DROP COLUMN IF EXISTS embedding;",
    );
  },
};
