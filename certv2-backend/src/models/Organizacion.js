const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/PostgretSQL');

const Organizacion = sequelize.define('Organizacion', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dominios: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  palabrasClave: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  telegramChatId: {
    type: DataTypes.STRING
  }
});

module.exports = Organizacion;
