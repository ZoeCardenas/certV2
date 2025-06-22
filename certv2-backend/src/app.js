const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();


const authRoutes = require('./routes/authRoutes');
const monitoreoRoutes = require('./routes/monitoreoRoutes');
const detalleRoutes = require('./routes/detalleRoutes');
const alertaRoutes = require('./routes/alertaRoutes');
const emailRoutes = require('./routes/emailRoutes');
const { connectDB } = require('./db/PostgreSQL');

const app = express();

// Middlewares globales
app.use(cors());
app.use(helmet());
app.use(express.json());

// Conexión a PostgreSQL
connectDB();

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/monitoreos', monitoreoRoutes);
app.use('/api', detalleRoutes);      // incluye: /monitoreos/:id/detalles y /detalles/:id
app.use('/api', alertaRoutes);       // incluye: /alertas y /alertas/:id
app.use('/api/email', emailRoutes);  // test de correo (opcional)

module.exports = app;
