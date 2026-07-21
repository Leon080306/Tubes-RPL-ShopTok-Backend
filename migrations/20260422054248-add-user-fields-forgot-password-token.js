'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Users', 'reset_token', {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: null,
        });
        await queryInterface.addColumn('Users', 'reset_token_expiry', {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: null,
        });
    },

    async down(queryInterface) {
        await queryInterface.removeColumn('Users', 'reset_token');
        await queryInterface.removeColumn('Users', 'reset_token_expiry');
    },
};