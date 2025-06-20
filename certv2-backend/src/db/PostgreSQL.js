const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.PG_DB,
  process.env.PG_USER,
  process.env.PG_PASS,
  {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    dialect: 'postgres',
    logging: false,
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('🟢 Conectado a PostgreSQL');
  } catch (error) {
    console.error('🔴 Error al conectar a PostgreSQL:', error.message);
  }
};

module.exports = { sequelize, connectDB };
