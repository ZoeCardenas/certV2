
// src/routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const checkRol = require('../middlewares/checkRol');
const usuarioCtrl = require('../controllers/usuarioController');

// Todas las rutas requieren autenticación
router.use(auth);

// Admin only: gestion completa de usuarios
router.get('/usuarios/count', checkRol(['admin']), usuarioCtrl.countUsuarios);
router.get('/usuarios', checkRol(['admin']), usuarioCtrl.getAllUsers);
router.get('/usuarios/:id', checkRol(['admin']), usuarioCtrl.getUserById);
router.put('/usuarios/:id', checkRol(['admin']), usuarioCtrl.updateUser);
router.delete('/usuarios/:id', checkRol(['admin']), usuarioCtrl.deleteUser);

module.exports = router;
