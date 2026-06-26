"use strict";

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("roles", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
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

    await queryInterface.createTable("permissions", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
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

    await queryInterface.createTable("user_roles", {
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
      },
      role_id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        references: { model: "roles", key: "id" },
        onDelete: "CASCADE",
      },
      assigned_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "users", key: "id" },
        onDelete: "SET NULL",
      },
      assigned_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.createTable("role_permissions", {
      role_id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        references: { model: "roles", key: "id" },
        onDelete: "CASCADE",
      },
      permission_id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        references: { model: "permissions", key: "id" },
        onDelete: "CASCADE",
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("role_permissions");
    await queryInterface.dropTable("user_roles");
    await queryInterface.dropTable("permissions");
    await queryInterface.dropTable("roles");
  },
};
