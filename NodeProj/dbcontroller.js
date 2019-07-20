const mysql = require('mysql');

const Sequelize = require('sequelize');

const sequelize = new Sequelize('school', 'user', 'P@ssw0rd', {
  host: '34.80.138.42',
  dialect: 'mysql',
  logging: false
});


sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

  module.exports = sequelize;
