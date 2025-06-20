const express = require('express');
const router = express.Router();
const { crearOrganizacion } = require('../controllers/organizacionController');
const authMiddleware = require('../auth/authMiddleware');

router.post('/', authMiddleware, crearOrganizacion);

module.exports = router;
