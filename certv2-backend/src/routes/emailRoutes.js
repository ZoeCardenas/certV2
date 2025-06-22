const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const { testCorreo } = require('../controllers/emailController');

router.post('/test', auth, testCorreo);

module.exports = router;
