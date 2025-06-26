const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");
const checkRol = require("../middlewares/checkRol");
const ctrl = require("../controllers/monitoreoController");
const Monitoreo = require("../models/Monitoreo"); // Add this import

/* ────────────────────────────────
   TODAS las rutas exigen JWT
─────────────────────────────────── */
router.use(auth);

/* ╔═══════════════════════════════╗
   ║           ADMIN ONLY          ║
   ╚═══════════════════════════════╝ */

/* ①  Listar TODOS los monitoreos activos (no eliminados) */
router.get(
  "/todos",
  checkRol(["admin"]),
  ctrl.getTodosMonitoreos
);

/* ②  Dominios de todos los monitoreos activos */
router.get(
  "/dominios/todos",
  checkRol(["admin"]),
  ctrl.getDominios
);

/* ╔═══════════════════════════════╗
   ║   ANALISTA  (o admin también) ║
   ╚═══════════════════════════════╝ */

/* ③  Listar monitoreos propios (o todos-activos si es admin) */
router.get(
  "/",
  checkRol(["analista", "admin"]),
  ctrl.getMonitoreos
);

/* ④  Crear nuevo monitoreo + detalles */
router.post(
  "/",
  checkRol(["analista", "admin"]),
  ctrl.crearMonitoreo
);

/* ⑤  Obtener uno (propio o cualquiera si admin) */
router.get(
  "/:id",
  checkRol(["analista", "admin"]),
  ctrl.getMonitoreo
);

/* ⑥  Actualizar organización / activo */
router.put(
  "/:id",
  checkRol(["analista", "admin"]),
  ctrl.actualizarMonitoreo
);

/* ⑦  Soft-delete definitivo  (eliminado=true, activo=false) */
router.delete(
  "/:id",
  checkRol(["analista", "admin"]),
  ctrl.eliminarMonitoreo
);

/* ⑧  Encender / apagar monitoreo (toggle activo) */
router.patch(
  "/:id/toggle",
  checkRol(["analista", "admin"]),
  async (req, res, next) => {
    // Additional check for whether the user has permission to toggle
    if (req.user.rol === "analista") {
      const monitoreo = await Monitoreo.findOne({
        where: { id: req.params.id, usuario_id: req.user.id },
      });

      if (!monitoreo) {
        return res.status(403).json({ error: "Acceso denegado" });
      }
    }

    // Proceed to toggle if the user is authorized
    return ctrl.toggleMonitoreo(req, res, next);
  }
);

/* ⑨  Listar detalles de un monitoreo concreto */
router.get(
  "/:id/detalles",
  checkRol(["analista", "admin"]),
  ctrl.getDominiosByMonitoreo
);


module.exports = router;
