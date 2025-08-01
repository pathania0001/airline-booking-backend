'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.renameColumn('flights','pricing','price');
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.renameColumn('flights', 'price', 'pricing');
  }
};
