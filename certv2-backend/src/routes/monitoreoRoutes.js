const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');

const {
  getMonitoreos,
  crearMonitoreo,
  getMonitoreo,
  actualizarMonitoreo,
  eliminarMonitoreo,
  toggleMonitoreo,
  getTodosMonitoreos
} = require('../controllers/monitoreoController');

router.use(auth);

// ⚠️ IMPORTANTE: poner antes rutas específicas como /todos
router.get('/todos', getTodosMonitoreos); // 🔁 Mover esta línea antes de '/:id'

router.get('/', getMonitoreos);
router.post('/', crearMonitoreo);
router.patch('/:id/toggle', toggleMonitoreo); 
router.get('/:id', getMonitoreo);
router.put('/:id', actualizarMonitoreo);
router.delete('/:id', eliminarMonitoreo);

module.exports = router;
 