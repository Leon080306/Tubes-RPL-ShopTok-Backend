'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // await queryInterface.addColumn("Products", "category_id", {
        //     type: Sequelize.UUID,
        //     allowNull: true,
        //     references: {
        //         model: "Categories",
        //         key: "category_id",
        //     },
        //     onDelete: "CASCADE",
        //     onUpdate: "CASCADE",
        // });
    },

    // async down(queryInterface) {
    //     await queryInterface.removeColumn("Products", "category_id");
    // },
};