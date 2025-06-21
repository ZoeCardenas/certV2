// src/routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();

// Ejemplo de endpoint
router.get('/', (req, res) => {
  res.json({ message: 'Usuarios funcionando 🚀' });
});

module.exports = router;
