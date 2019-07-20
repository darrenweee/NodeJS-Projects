'use strict';
module.exports = (sequelize, DataTypes) => {
  const students = sequelize.define('students', {
    student_email: DataTypes.STRING,
    status: DataTypes.INTEGER
  }, {
    timestamps: false
  });
  students.removeAttribute('id');
  students.associate = function(models) {
    // associations can be defined here
  };
  return students;
};