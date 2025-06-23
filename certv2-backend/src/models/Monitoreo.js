/* src/models/Monitoreo.js
   Modelo con DOS banderas:
   ─ activo     → ON / OFF operativo
   ─ eliminado  → borrado lógico           */

const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/PostgreSQL");
const Usuario = require("./Usuario");

const Monitoreo = sequelize.define(
  "Monitoreo",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    /* Organización o nombre del cliente  */
    organizacion: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    /* ¿El watcher debe vigilarlo? (toggle) */
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: "ON/OFF para el proceso de monitoreo",
    },

    /* Borrado lógico — si true nunca se muestra */
    eliminado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Soft-delete; oculto en dashboard",
    },
  },
  {
    tableName: "monitoreos",
    timestamps: true,
  }
);

/* Relaciones */
Monitoreo.belongsTo(Usuario, { foreignKey: "usuario_id" });
Usuario.hasMany(Monitoreo,   { foreignKey: "usuario_id" });

module.exports = Monitoreo;
