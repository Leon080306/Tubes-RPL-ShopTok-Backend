'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Chats', 'sender_role', {
      type: Sequelize.STRING(10),
      allowNull: false,
      defaultValue: 'customer',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Chats', 'sender_role');
  },
};