'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  /* --------------- UP: agrega la columna ---------------- */
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'monitoreos',          // tabla
      'eliminado',           // nueva columna
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Soft-delete; si es true el registro no se muestra',
      }
    );
  },

  /* --------------- DOWN: quita la columna --------------- */
  async down(queryInterface) {
    await queryInterface.removeColumn('monitoreos', 'eliminado');
  },
};
