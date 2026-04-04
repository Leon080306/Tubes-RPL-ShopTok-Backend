'use strict';

const query = require('pg/lib/native/query');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("CartItems", {
      user_id: {
        type: Sequelize.UUID,
        references: {
          model: "Users",
          key: "user_id"
        },
        allowNull: false,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        primaryKey: true
      },
      variant_id: {
        type: Sequelize.UUID,
        references: {
          model: "ProductVariants",
          key: "variant_id"
        },
        allowNull: false,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        primaryKey: true
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      is_selected: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("CartItems");
  }
};
