"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Coleta", "coletaType", {
      type: Sequelize.ENUM("Microscópica", "Colonia"),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Coleta", "coletaType");

    // necessário no PostgreSQL
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Coleta_coletaType";',
    );
  },
};
