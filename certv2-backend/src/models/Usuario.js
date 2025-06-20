const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/postgres');
const bcrypt = require('bcrypt');

const Usuario = sequelize.define('Usuario', {
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  hooks: {
    beforeCreate: async (usuario) => {
      usuario.password = await bcrypt.hash(usuario.password, 10);
    }
  }
});

module.exports = Usuario;
