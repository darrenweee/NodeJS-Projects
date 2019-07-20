'use strict';
module.exports = (sequelize, DataTypes) => {
  const teachers = sequelize.define('teachers', {
    teacher_email: DataTypes.STRING,
    status: DataTypes.INTEGER
  }, {
    timestamps: false
  });
  teachers.removeAttribute('id');
  teachers.associate = function(models) {
    // associations can be defined here
  };
  return teachers;
};