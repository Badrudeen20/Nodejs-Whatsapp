'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'Chats',           // name of the table
      'friend_mobile',   // name of the new column
      {
        type: Sequelize.INTEGER,  // data type of the new column
        allowNull: true,         // allowNull or not
      }
    );
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
