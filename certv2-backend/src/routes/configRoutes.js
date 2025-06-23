const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const checkRol = require('../middlewares/checkRol');
const {
  obtenerConfiguracion,
  actualizarConfiguracion
} = require('../controllers/configController');

// Aplica middleware de autenticación y rol
router.use(auth);
router.use(checkRol(['admin'])); // Solo admin puede acceder

router.get('/', obtenerConfiguracion);
router.put('/', actualizarConfiguracion);

module.exports = router;
