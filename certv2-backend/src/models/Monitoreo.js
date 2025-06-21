const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/PostgreSQL');
const Usuario = require('./Usuario');

const Monitoreo = sequelize.define('Monitoreo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  organizacion: {
    type: DataTypes.STRING,
    allowNull: false
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'monitoreos',
  timestamps: true
});

Monitoreo.belongsTo(Usuario, { foreignKey: 'usuario_id' });
Usuario.hasMany(Monitoreo, { foreignKey: 'usuario_id' });

module.exports = Monitoreo;
