"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("issues", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      category: {
        type: Sequelize.ENUM(
          "Roads",
          "Lighting",
          "Utilities",
          "Sanitation",
          "Parks",
          "Noise",
          "Safety",
        ),
        allowNull: false,
      },
      neighborhood: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM(
          "Reported",
          "Acknowledged",
          "In Progress",
          "Resolved",
        ),
        allowNull: false,
        defaultValue: "Reported",
      },
      upvotes: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      ai_routing_note: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      submitted_by_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
      },
      assigned_to_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "users", key: "id" },
        onDelete: "SET NULL",
      },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("issues");
  },
};
