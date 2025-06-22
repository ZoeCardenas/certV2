const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/PostgreSQL');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rol: {  // ← NUEVO
    type: DataTypes.ENUM('admin', 'analista'),
    allowNull: false,
    defaultValue: 'analista'
  },
  telegram_token: {
    type: DataTypes.STRING,
    allowNull: true
  },
  telegram_chat_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  correo_alerta: {
    type: DataTypes.STRING,
    allowNull: true
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'usuarios',
  timestamps: true
});

module.exports = Usuario;
