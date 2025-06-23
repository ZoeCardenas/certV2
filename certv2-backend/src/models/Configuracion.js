// models/Configuracion.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/PostgreSQL');

const Configuracion = sequelize.define('Configuracion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  correo_alerta: {
    type: DataTypes.STRING,
    allowNull: true
  },
  telegram_token: {
    type: DataTypes.STRING,
    allowNull: true
  },
  telegram_chat_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'configuraciones',
  timestamps: true
});

module.exports = Configuracion;
