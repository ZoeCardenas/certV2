// src/app.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const authRoutes       = require("./routes/authRoutes");
const monitoreoRoutes  = require("./routes/monitoreoRoutes");
const detalleRoutes    = require("./routes/detalleRoutes");
const alertaRoutes     = require("./routes/alertaRoutes");
const emailRoutes      = require("./routes/emailRoutes");
const configRouter     = require("./routes/configRoutes");
const { connectDB }    = require("./db/PostgreSQL");

const app = express();

/* ────────────────────────────────────────────────────────────
   Middlewares globales
   ──────────────────────────────────────────────────────────── */

// CORS – permite al frontend de Vite (5173) acceder sin bloqueos
app.use(
  cors({
    origin: "http://localhost:5173",   // ← front en desarrollo
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH","OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
  })
);

// Helmet con CORP desactivado para evitar bloqueos extra
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// Parseo JSON
app.use(express.json());

/* ────────────────────────────────────────────────────────────
   Conexión a PostgreSQL
   ──────────────────────────────────────────────────────────── */
connectDB();

/* ────────────────────────────────────────────────────────────
   Rutas API
   ──────────────────────────────────────────────────────────── */
app.use("/api/auth",        authRoutes);
app.use("/api/monitoreos",  monitoreoRoutes);
app.use("/api",             detalleRoutes);   // /monitoreos/:id/detalles y /detalles/:id
app.use("/api",             alertaRoutes);    // /alertas y /alertas/:id
app.use("/api/email",       emailRoutes);     // pruebas de correo
app.use("/api/config",      configRouter);    // configuración

module.exports = app;
