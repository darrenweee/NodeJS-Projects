'use strict';
module.exports = (sequelize, DataTypes) => {
  const teachers_students = sequelize.define('teachers_students', {
    teacher_email: DataTypes.STRING,
    student_email: DataTypes.STRING
  }, {
    timestamps: false
  });
  teachers_students.removeAttribute('id');
  teachers_students.associate = function(models) {
    // associations can be defined here
  };
  return teachers_students;
};