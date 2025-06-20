const { DataTypes } = require('sequelize');
const db = require('../db/PostgreSQL');
const Monitoreo = require('./Monitoreo');

const MonitoreoDetalle = db.define('MonitoreoDetalle', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  dominio: {
    type: DataTypes.STRING,
    allowNull: false
  },
  palabra_clave: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'monitoreo_detalles',
  timestamps: true
});

MonitoreoDetalle.belongsTo(Monitoreo, { foreignKey: 'monitoreo_id' });
Monitoreo.hasMany(MonitoreoDetalle, { foreignKey: 'monitoreo_id' });

module.exports = MonitoreoDetalle;
