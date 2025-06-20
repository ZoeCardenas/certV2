const { DataTypes } = require('sequelize');
const db = require('../db/PostgreSQL');
const Usuario = require('./Usuario');
const Monitoreo = require('./Monitoreo');

const Alerta = db.define('Alerta', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  dominio_detectado: {
    type: DataTypes.STRING,
    allowNull: false
  },
  palabra_clave_detectada: {
    type: DataTypes.STRING,
    allowNull: false
  },
  enviado_por: {
    type: DataTypes.ENUM('correo', 'telegram'),
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'alertas',
  timestamps: false
});

Alerta.belongsTo(Usuario, { foreignKey: 'usuario_id' });
Usuario.hasMany(Alerta, { foreignKey: 'usuario_id' });

Alerta.belongsTo(Monitoreo, { foreignKey: 'monitoreo_id' });
Monitoreo.hasMany(Alerta, { foreignKey: 'monitoreo_id' });

module.exports = Alerta;
