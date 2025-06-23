const express = require("express");
const router  = express.Router();
const auth    = require("../middlewares/authMiddleware");
const checkRol = require("../middlewares/checkRol");
const {
  getMonitoreos,
  crearMonitoreo,
  getMonitoreo,
  actualizarMonitoreo,
  eliminarMonitoreo,
  toggleMonitoreo,
  getTodosMonitoreos,
  getDominios,              // ← nuevo
  getDominiosByMonitoreo,   // ← nuevo
} = require("../controllers/monitoreoController");

router.use(auth);

/* Admin */
router.get("/todos",          checkRol(["admin"]), getTodosMonitoreos);
router.get("/dominios/todos", checkRol(["admin"]), getDominios);

/* Analista */
router.get("/",        checkRol(["analista"]), getMonitoreos);
router.post("/",       checkRol(["analista","admin"]), crearMonitoreo);
router.patch("/:id/toggle", checkRol(["analista"]), toggleMonitoreo);
router.get("/:id",     checkRol(["analista","admin"]), getMonitoreo);
router.get("/:id/detalles", checkRol(["analista","admin"]), getDominiosByMonitoreo);
router.put("/:id",     checkRol(["analista"]), actualizarMonitoreo);
router.delete("/:id",  checkRol(["analista"]), eliminarMonitoreo);

module.exports = router;
