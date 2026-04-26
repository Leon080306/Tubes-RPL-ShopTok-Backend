// migrations/XXXXXX-increase-amount-paid-precision.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Orders", "amount_paid", {
      type: Sequelize.DECIMAL(15, 2), // max ~9.99 trillion
      allowNull: false,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Orders", "amount_paid", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    });
  },
};