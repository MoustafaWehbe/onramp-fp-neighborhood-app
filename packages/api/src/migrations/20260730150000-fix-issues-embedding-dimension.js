"use strict";

// The original 20260713000000-add-embedding-to-issues.js migration created
// `embedding` as vector(1536) (OpenAI's dimension) and already ran
// successfully against this database before the project switched to
// Mistral's mistral-embed model, which produces 1024-dimensional vectors.
// Sequelize tracks completed migrations by filename, so editing that old
// file doesn't change an already-migrated database — this migration fixes
// the live column instead.
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(
      "ALTER TABLE issues ALTER COLUMN embedding TYPE vector(1024) USING NULL;",
    );
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      "ALTER TABLE issues ALTER COLUMN embedding TYPE vector(1536) USING NULL;",
    );
  },
};
