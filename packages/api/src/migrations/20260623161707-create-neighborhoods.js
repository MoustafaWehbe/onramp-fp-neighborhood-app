"use strict";

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("neighborhoods", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(120),
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING(140),
        allowNull: false,
        unique: true,
      },
      city: {
        type: Sequelize.STRING(120),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("neighborhoods");
  },
};
