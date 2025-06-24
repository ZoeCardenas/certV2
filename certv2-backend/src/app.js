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
const usuarioRoutes    = require("./routes/usuarioRoutes");
// const certificadoRoutes = require("./routes/certificadoRoutes"); // si lo tienes
const { connectDB }    = require("./db/PostgreSQL");

const app = express();

// Middlewares globales
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET","POST","PUT","DELETE","PATCH","OPTIONS"],
    allowedHeaders: ["Content-Type","Authorization"],
    optionsSuccessStatus: 200
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);

// Parseo JSON
app.use(express.json());

// Conexión a PostgreSQL
connectDB();

// Rutas API
app.use("/api/auth",       authRoutes);
app.use("/api/monitoreos", monitoreoRoutes);
app.use("/api",            detalleRoutes);
app.use("/api",            alertaRoutes);
app.use("/api/email",      emailRoutes);
app.use("/api/config",     configRouter);

// Monta aquí las rutas de usuarios y certificados:
app.use("/api",            usuarioRoutes);
// app.use("/api",            certificadoRoutes); // descomenta si tienes este router

module.exports = app;
