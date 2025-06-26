require('dotenv').config({ path: __dirname + '/../../.env' });
const { Sequelize } = require('sequelize');

// 🔍 Imprimir variables para depuración
console.log('🧪 DEBUG ENV VARIABLES');
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASS:', process.env.DB_PASS);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('Tipo de contraseña (DB_PASS):', typeof process.env.DB_PASS);

// 🔧 Usar la correcta según cuál esté definida
const password = process.env.DB_PASS || process.env.DB_PASSWORD;

// Crear conexión con Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  password,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
  }
);

// Verificar conexión
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('🟢 Conectado a PostgreSQL');
    console.log('📌 Base de datos:', process.env.DB_NAME);
    console.log('👤 Usuario:', process.env.DB_USER);
    console.log('📍 Host:', process.env.DB_HOST);
    console.log('🔌 Puerto:', process.env.DB_PORT);
  } catch (error) {
    console.error('🔴 Error al conectar a PostgreSQL:', error.message);
  }
};

module.exports = { sequelize, connectDB };
