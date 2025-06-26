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
// Ahora: admin y analista pueden actualizar su propia configuración
router.use(checkRol(['admin', 'analista']));

router.get('/', obtenerConfiguracion);
router.put('/', actualizarConfiguracion);

module.exports = router;
