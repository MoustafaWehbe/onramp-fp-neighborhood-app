"use strict";

const now = new Date();

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("permissions", [
      {
        name: "issues:create",
        description: "Create issues",
        created_at: now,
        updated_at: now,
      },
      {
        name: "issues:read",
        description: "Read issues",
        created_at: now,
        updated_at: now,
      },
      {
        name: "issues:update-own",
        description: "Update own issues",
        created_at: now,
        updated_at: now,
      },
      {
        name: "issues:update-any",
        description: "Update any issue",
        created_at: now,
        updated_at: now,
      },
      {
        name: "issues:delete",
        description: "Delete issues",
        created_at: now,
        updated_at: now,
      },
      {
        name: "comments:create",
        description: "Create comments",
        created_at: now,
        updated_at: now,
      },
      {
        name: "comments:read",
        description: "Read comments",
        created_at: now,
        updated_at: now,
      },
      {
        name: "comments:delete-own",
        description: "Delete own comments",
        created_at: now,
        updated_at: now,
      },
      {
        name: "comments:delete-any",
        description: "Delete any comment",
        created_at: now,
        updated_at: now,
      },
      {
        name: "admin:users:read",
        description: "Read users",
        created_at: now,
        updated_at: now,
      },
      {
        name: "admin:users:update-role",
        description: "Manage user roles",
        created_at: now,
        updated_at: now,
      },
      {
        name: "admin:categories:create",
        description: "Create categories",
        created_at: now,
        updated_at: now,
      },
      {
        name: "admin:categories:update",
        description: "Update categories",
        created_at: now,
        updated_at: now,
      },
      {
        name: "admin:categories:delete",
        description: "Delete categories",
        created_at: now,
        updated_at: now,
      },
      {
        name: "admin:neighborhoods:create",
        description: "Create neighborhoods",
        created_at: now,
        updated_at: now,
      },
      {
        name: "admin:neighborhoods:update",
        description: "Update neighborhoods",
        created_at: now,
        updated_at: now,
      },
      {
        name: "admin:neighborhoods:delete",
        description: "Delete neighborhoods",
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("permissions", null, {});
  },
};
