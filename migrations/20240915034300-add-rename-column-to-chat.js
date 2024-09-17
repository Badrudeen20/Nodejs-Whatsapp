'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('Chats', 'contact_id', 'mobile');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn('Chats', 'mobile', 'contact_id');
  }
};
