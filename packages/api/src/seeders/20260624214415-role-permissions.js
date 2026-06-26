"use strict";

const rolePermissions = {
  resident: [
    "issues:create",
    "issues:read",
    "issues:update-own",
    "comments:create",
    "comments:read",
    "comments:delete-own",
  ],

  moderator: [
    "issues:create",
    "issues:read",
    "issues:update-own",
    "comments:create",
    "comments:read",
    "comments:delete-own",
    "issues:update-any",
    "comments:delete-any",
  ],

  admin: [
    "issues:create",
    "issues:read",
    "issues:update-own",
    "comments:create",
    "comments:read",
    "comments:delete-own",
    "issues:update-any",
    "comments:delete-any",
    "admin:users:read",
    "admin:users:update-role",
    "admin:categories:create",
    "admin:categories:update",
    "admin:categories:delete",
    "admin:neighborhoods:create",
    "admin:neighborhoods:update",
    "admin:neighborhoods:delete",
  ],

  platform_admin: [
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
  ],
};

module.exports = {
  async up(queryInterface, Sequelize) {
    const roles = await queryInterface.sequelize.query(
      "SELECT id, name FROM roles;",
      { type: Sequelize.QueryTypes.SELECT }
    );

    const permissions = await queryInterface.sequelize.query(
      "SELECT id, name FROM permissions;",
      { type: Sequelize.QueryTypes.SELECT }
    );

    const roleMap = new Map(roles.map((role) => [role.name, role.id]));
    const permissionMap = new Map(
      permissions.map((permission) => [permission.name, permission.id])
    );

    const rows = [];

    for (const [roleName, permissionNames] of Object.entries(rolePermissions)) {
      const roleId = roleMap.get(roleName);

      if (!roleId) {
        throw new Error(`Missing role: ${roleName}`);
      }

      for (const permissionName of permissionNames) {
        const permissionId = permissionMap.get(permissionName);

        if (!permissionId) {
          throw new Error(`Missing permission: ${permissionName}`);
        }

        rows.push({
          role_id: roleId,
          permission_id: permissionId,
          created_at: new Date(),
        });
      }
    }

    await queryInterface.bulkInsert("role_permissions", rows);
  },

  async down(queryInterface, Sequelize) {
    const permissions = await queryInterface.sequelize.query(
      "SELECT id, name FROM permissions;",
      { type: Sequelize.QueryTypes.SELECT }
    );

    const permissionNames = [...new Set(Object.values(rolePermissions).flat())];
    const permissionIds = permissions
      .filter((permission) => permissionNames.includes(permission.name))
      .map((permission) => permission.id);

    await queryInterface.bulkDelete("role_permissions", {
      permission_id: permissionIds,
    });
  },
};
