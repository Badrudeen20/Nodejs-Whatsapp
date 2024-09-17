'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Chats', 'mobile');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('Chats', 'mobile', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  }
};