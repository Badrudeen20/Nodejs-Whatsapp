'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Chats', 'chat_id');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('Chats', 'chat_id', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  }
};
