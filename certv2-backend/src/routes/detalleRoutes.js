const express = require("express");
const router  = express.Router();
const auth    = require("../middlewares/authMiddleware");
const checkRol = require("../middlewares/checkRol");
const {
  obtenerDetalles,
  actualizarDetalle,
  eliminarDetalle,
} = require("../controllers/detalleController");

router.use(auth);

/* ver detalles por monitoreo */
router.get("/monitoreos/:id/detalles", checkRol(["analista", "admin"]), obtenerDetalles);

/* actualizar & borrar un detalle */
router.put   ("/detalles/:id", checkRol(["analista", "admin"]), actualizarDetalle);
router.delete("/detalles/:id", checkRol(["analista", "admin"]), eliminarDetalle);

module.exports = router;
