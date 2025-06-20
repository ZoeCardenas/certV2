const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/authController');
const authMiddleware = require('../auth/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getProfile);

module.exports = router;
