// seed.js
require('dotenv').config();
const bcrypt = require('bcrypt');
const { Sequelize } = require('sequelize');
const Usuario = require('./src/models/Usuario');

console.log("🧪 DEBUG ENV VARIABLES");
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASS:", process.env.DB_PASS);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("Tipo de contraseña (DB_PASS):", typeof process.env.DB_PASS);

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS || process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false
  }
);

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log('🟢 Conectado a PostgreSQL');
    console.log(`📌 Base de datos: ${process.env.DB_NAME}`);
    console.log(`👤 Usuario: ${process.env.DB_USER}`);
    console.log(`📍 Host: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`🔌 Puerto: ${process.env.DB_PORT || 5432}`);

    const usuarios = [
      {
        nombre: 'Administrador Principal',
        email: 'admin@admin.com',
        password: 'admin',
        rol: 'admin'
      },
      {
        nombre: 'Analista Seguridad',
        email: 'analista@analista.com',
        password: 'analista',
        rol: 'analista'
      },
      {
        nombre: 'Soporte Técnico',
        email: 'soporte@soporte.com',
        password: 'soporte',
        rol: 'analista'
      }
    ];

    for (const u of usuarios) {
      const existe = await Usuario.findOne({ where: { email: u.email } });

      if (existe) {
        const yaEsHash = existe.password?.startsWith('$2b$');
        if (!yaEsHash) {
          const hashed = await bcrypt.hash(u.password, 10);
          await Usuario.update({ password: hashed }, { where: { email: u.email } });
          console.log(`🔄 Contraseña actualizada para: ${u.email}`);
        } else {
          console.log(`⚠️  Usuario ya tiene contraseña hasheada: ${u.email}`);
        }
        continue;
      }

      const hashed = await bcrypt.hash(u.password, 10);
      await Usuario.create({
        nombre: u.nombre,
        email: u.email,
        password: hashed,
        rol: u.rol
      });

      console.log(`✅ Usuario creado: ${u.email}`);
    }

    await sequelize.close();
    console.log("🔒 Conexión cerrada");
  } catch (err) {
    console.error('❌ Error al conectar o insertar datos:', err);
  }
};

seed();
