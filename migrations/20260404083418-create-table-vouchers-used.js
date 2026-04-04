'use strict';

const query = require('pg/lib/native/query');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("VouchersUsed", {
      voucher_id: {
        type: Sequelize.UUID,
        references: {
          model: "Vouchers",
          key: "voucher_id"
        },
        allowNull: false,
        primaryKey: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      order_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Orders",
          key: "order_id"
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        primaryKey: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("VouchersUsed");
  }
};
