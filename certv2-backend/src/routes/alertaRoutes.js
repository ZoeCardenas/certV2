const express = require('express');
const router = express.Router();
const authMiddleware = require('../auth/authMiddleware'); // ✅ sin destructurar
const { getAlertas, getAlerta } = require('../controllers/alertaController');

router.use(authMiddleware); // ✅ usa el nombre correcto

router.get('/alertas', getAlertas);
router.get('/alertas/:id', getAlerta);

module.exports = router;
