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

    await queryInterface.addConstraint(
      'Airports',
      {
        fields:['city_Id'],
        type:'FOREIGN KEY',
        name:'city_foreign_key_constraint',
        references:{
          table:'Cities',
          field:'id',
        },
        onDelete:'cascade',
        onUpdate:'cascade',
      } 
    
    )},

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.removeConstraint('Airports','city_foreign_key_constraint');
  }
};
