"use strict";

const permissions = [
  "issues:create",
  "issues:read",
  "issues:update-own",
  "issues:update-any",
  "issues:delete",

  "comments:create",
  "comments:read",
  "comments:delete-own",
  "comments:delete-any",

  "admin:users:read",
  "admin:users:update-role",

  "admin:categories:create",
  "admin:categories:update",
  "admin:categories:delete",

  "admin:neighborhoods:create",
  "admin:neighborhoods:update",
  "admin:neighborhoods:delete",
];

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert(
      "permissions",
      permissions.map((name) => ({
        name,
        description: name,
        created_at: now,
        updated_at: now,
      }))
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("permissions", {
      name: {
        [Sequelize.Op.in]: permissions,
      },
    });
  },
};
