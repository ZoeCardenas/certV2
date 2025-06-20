const express = require('express');
const router = express.Router();
const auth = require('../auth/authMiddleware');
const { getAlertas, getAlerta } = require('../controllers/alertaController');

router.use(auth);

router.get('/alertas', getAlertas);
router.get('/alertas/:id', getAlerta);

module.exports = router;
