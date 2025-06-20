const express = require('express');
const router = express.Router();
const auth = require('../auth/authMiddleware');
const { obtenerDetalles, eliminarDetalle } = require('../controllers/detalleController');

router.use(auth);

router.get('/monitoreos/:id/detalles', obtenerDetalles);
router.delete('/detalles/:id', eliminarDetalle);

module.exports = router;
