const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const checkRol = require('../middlewares/checkRol');
const { getAlertas, getAlerta } = require('../controllers/alertaController');

router.use(authMiddleware);

// 🛡️ Admin: Ver todas las alertas
router.get('/alertas', checkRol(['admin']), getAlertas);

// 🛡️ Analista: Ver las suyas (podrías tener otro endpoint como /alertas/mias)
router.get('/alertas/:id', checkRol(['analista', 'admin']), getAlerta);

module.exports = router;
