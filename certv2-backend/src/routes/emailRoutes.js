const express = require('express');
const router = express.Router();
const auth = require('../auth/authMiddleware');
const { testCorreo } = require('../controllers/emailController');

router.post('/test', auth, testCorreo);

module.exports = router;
