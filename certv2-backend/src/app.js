const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const authRoutes = require('./src/routes/authRoutes');
const organizacionRoutes = require('./src/routes/organizacionRoutes');
const { connectDB } = require('./src/db/PostgretSQL');

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

// Conexión a base de datos PostgreSQL
connectDB();

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/organizaciones', organizacionRoutes);

module.exports = app;
