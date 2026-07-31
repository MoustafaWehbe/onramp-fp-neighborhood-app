"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      "ALTER TABLE issues ADD COLUMN IF NOT EXISTS embedding vector(1024);",
    ); //OpenAI's text-embedding-ada-002 model produces embeddings with 1536 dimensions.This is the standard size — each issue's title + description gets converted into a list of 1536 numbers that represent its meaning mathematically
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      "ALTER TABLE issues DROP COLUMN IF EXISTS embedding;",
    );
  },
};
