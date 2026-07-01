"use strict";

const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 12;

module.exports = {
  async up(queryInterface) {
    const name = process.env.PLATFORM_ADMIN_NAME;
    const email = process.env.PLATFORM_ADMIN_EMAIL;
    const password = process.env.PLATFORM_ADMIN_PASSWORD;

    if (!name || !email || !password) {
      throw new Error(
        "Missing PLATFORM_ADMIN_NAME, PLATFORM_ADMIN_EMAIL, or PLATFORM_ADMIN_PASSWORD"
      );
    }

    const [platformAdminRole] = await queryInterface.sequelize.query(
      `
      SELECT id
      FROM roles
      WHERE name = 'platform_admin'
      LIMIT 1
      `,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (!platformAdminRole) {
      throw new Error("Missing platform_admin role. Run role seeders first.");
    }

    const [existingUser] = await queryInterface.sequelize.query(
      `
      SELECT id
      FROM users
      WHERE email = :email
      LIMIT 1
      `,
      {
        replacements: { email },
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );

    let userId = existingUser?.id;

    if (!userId) {
      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

      const [createdUser] = await queryInterface.sequelize.query(
        `
        INSERT INTO users (
          id,
          email,
          password_hash,
          name,
          email_verified,
          created_at,
          updated_at
        )
        VALUES (
          gen_random_uuid(),
          :email,
          :passwordHash,
          :name,
          true,
          NOW(),
          NOW()
        )
        RETURNING id
        `,
        {
          replacements: {
            email,
            passwordHash,
            name,
          },
          type: queryInterface.sequelize.QueryTypes.INSERT,
        }
      );

      userId = Array.isArray(createdUser)
        ? createdUser[0]?.id
        : createdUser?.id;
    }

    if (!userId) {
      throw new Error("Failed to create or find platform admin user.");
    }

    await queryInterface.sequelize.query(
      `
      INSERT INTO user_roles (
        user_id,
        role_id,
        assigned_by,
        assigned_at
      )
      VALUES (
        :userId,
        :roleId,
        NULL,
        NOW()
      )
      ON CONFLICT (user_id, role_id) DO NOTHING
      `,
      {
        replacements: {
          userId,
          roleId: platformAdminRole.id,
        },
      }
    );
  },

  async down(queryInterface) {
    const email = process.env.PLATFORM_ADMIN_EMAIL;

    if (!email) {
      throw new Error("Missing PLATFORM_ADMIN_EMAIL");
    }

    const [existingUser] = await queryInterface.sequelize.query(
      `
      SELECT id
      FROM users
      WHERE email = :email
      LIMIT 1
      `,
      {
        replacements: { email },
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );

    if (!existingUser) {
      return;
    }

    await queryInterface.sequelize.query(
      `
      DELETE FROM user_roles
      WHERE user_id = :userId
      `,
      {
        replacements: { userId: existingUser.id },
      }
    );

    await queryInterface.sequelize.query(
      `
      DELETE FROM users
      WHERE id = :userId
      `,
      {
        replacements: { userId: existingUser.id },
      }
    );
  },
};
