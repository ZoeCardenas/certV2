// src/routes/detalleRoutes.js
const express = require('express');
const router = express.Router(); // ✅ DEBE IR ANTES DE usar router
const auth = require('../middlewares/authMiddleware');
const checkRol = require('../middlewares/checkRol'); // ✅ Faltaba importar esto

const {
  obtenerDetalles,
  eliminarDetalle
} = require('../controllers/detalleController');

// ✅ Protege todas las rutas con autenticación
router.use(auth);

// ✅ Solo analistas pueden acceder a detalles
router.get('/monitoreos/:id/detalles', checkRol(['analista']), obtenerDetalles);
router.delete('/detalles/:id', checkRol(['analista']), eliminarDetalle);

module.exports = router;
