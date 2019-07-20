'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('teachers_students', {
      teacher_email: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      student_email: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('teachers_students');
  }
};