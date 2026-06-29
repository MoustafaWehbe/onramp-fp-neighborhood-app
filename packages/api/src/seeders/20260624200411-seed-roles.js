"use strict";

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert("roles", [
      {
        name: "resident",
        description: "Default user role for residents",
        created_at: now,
        updated_at: now,
      },
      {
        name: "moderator",
        description: "Can moderate issues and content",
        created_at: now,
        updated_at: now,
      },
      {
        name: "admin",
        description: "Can manage neighborhoods, categories, and users",
        created_at: now,
        updated_at: now,
      },
      {
        name: "platform_admin",
        description: "Full platform access",
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("roles", {
      name: ["resident", "moderator", "admin", "platform_admin"],
    });
  },
};
