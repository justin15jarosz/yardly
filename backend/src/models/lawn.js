const { DataTypes } = require('sequelize');
const sequelize = require('../services/database');

const Lawn = sequelize.define('Lawn', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  area: {
    type: DataTypes.GEOMETRY('POLYGON', 4326),
    allowNull: false
  }
}, {
  tableName: 'lawns'
});

module.exports = Lawn;
