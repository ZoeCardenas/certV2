const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const checkRol = require('../middlewares/checkRol');
const {
  getAlertas,
  countAlertas,
  getAlerta
} = require('../controllers/alertaController');

router.use(auth);

// 1️⃣ Rutas estáticas primero:
router.get('/alertas/count',  checkRol(['admin','analista']), countAlertas);
router.get('/alertas',        checkRol(['admin','analista']), getAlertas);

// 2️⃣ Luego la ruta dinámica:
router.get('/alertas/:id',    checkRol(['admin','analista']), getAlerta);

module.exports = router;
