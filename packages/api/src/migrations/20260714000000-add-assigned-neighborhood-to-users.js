"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "assigned_neighborhood", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("users", "assigned_neighborhood");
  },
};