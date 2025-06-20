const express = require('express');
const router = express.Router();
const auth = require('../auth/authMiddleware');
const {
  getMonitoreos,
  crearMonitoreo,
  getMonitoreo,
  actualizarMonitoreo,
  eliminarMonitoreo
} = require('../controllers/monitoreoController');

router.use(auth);

router.get('/', getMonitoreos);
router.post('/', crearMonitoreo);
router.get('/:id', getMonitoreo);
router.put('/:id', actualizarMonitoreo);
router.delete('/:id', eliminarMonitoreo);

module.exports = router;
