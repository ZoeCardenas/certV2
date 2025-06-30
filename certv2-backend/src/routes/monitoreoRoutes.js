// src/routes/monitoreos.js
const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");
const checkRol = require("../middlewares/checkRol");
const ctrl = require("../controllers/monitoreoController");

// Todas las rutas requieren JWT
router.use(auth);

/* ADMIN ONLY (global) */
router.get(
  "/todos",            // ① Listar todos
  checkRol(["admin"]),
  ctrl.getTodosMonitoreos
);
router.get(
  "/dominios/todos",   // ② Dominios de todos
  checkRol(["admin"]),
  ctrl.getDominios
);

/* ANALISTA (o admin sobre propio) */
router.get(
  "/",                // ③ Listar propios (o todos si admin)
  checkRol(["analista", "admin"]),
  ctrl.getMonitoreos
);
router.post(
  "/",                // ④ Crear
  checkRol(["analista", "admin"]),
  ctrl.crearMonitoreo
);
router.get(
  "/:id",             // ⑤ Obtener uno
  checkRol(["analista", "admin"]),
  ctrl.getMonitoreo
);
router.put(
  "/:id",             // ⑥ Actualizar
  checkRol(["analista", "admin"]),
  ctrl.actualizarMonitoreo
);
router.delete(
  "/:id",             // ⑦ Soft-delete
  checkRol(["analista", "admin"]),
  ctrl.eliminarMonitoreo
);

router.patch(
  "/:id/toggle",
  checkRol(["analista", "admin"]),  // Verificación de roles
  ctrl.toggleMonitoreo               // Usa la función común para ambos casos
);

router.get(
  "/:id/detalles",     // ⑨ Detalles de un monitoreo
  checkRol(["analista", "admin"]),
  ctrl.getDominiosByMonitoreo
);

module.exports = router;
