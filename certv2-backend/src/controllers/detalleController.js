/* src/controllers/detalleController.js */
const MonitoreoDetalle = require("../models/MonitoreoDetalle");
const Monitoreo        = require("../models/Monitoreo");

/* ──────────────────────────────────────────────
   GET /api/monitoreos/:id/detalles
   (analista y admin)
─────────────────────────────────────────────── */
exports.obtenerDetalles = async (req, res) => {
  const { id: monitoreoId } = req.params;

  try {
    /* Si no es admin, verifica que el monitoreo sea suyo */
    if (req.user.rol !== "admin") {
      const propio = await Monitoreo.findOne({
        where: { id: monitoreoId, usuario_id: req.user.id },
      });
      if (!propio)
        return res
          .status(404)
          .json({ error: "Monitoreo no encontrado o no autorizado" });
    }

    const detalles = await MonitoreoDetalle.findAll({
      where: { monitoreo_id: monitoreoId, eliminado: false },  // Filtrar por no eliminados
      order: [["createdAt", "DESC"]],
    });
    res.json(detalles);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al obtener detalles" });
  }
};

/* ──────────────────────────────────────────────
   PUT /api/detalles/:id
─────────────────────────────────────────────── */
exports.actualizarDetalle = async (req, res) => {
  const { id } = req.params;
  const { dominio, palabra_clave } = req.body;

  if (!dominio?.trim() || !palabra_clave?.trim()) {
    return res.status(400).json({ error: "Campos requeridos" });
  }

  try {
    /* Garantiza que el usuario sea dueño o admin */
    const detalle = await MonitoreoDetalle.findByPk(id, {
      include: { model: Monitoreo, attributes: ["usuario_id"] },
    });
    if (
      !detalle ||
      (req.user.rol !== "admin" && detalle.Monitoreo.usuario_id !== req.user.id) ||
      detalle.eliminado // Si el detalle está marcado como eliminado
    ) {
      return res
        .status(404)
        .json({ error: "Detalle no encontrado o no autorizado" });
    }

    await detalle.update({ dominio, palabra_clave });
    res.json({ mensaje: "Detalle actualizado" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al actualizar detalle" });
  }
};

/* ──────────────────────────────────────────────
   DELETE /api/detalles/:id (Borrado lógico)
─────────────────────────────────────────────── */
exports.eliminarDetalle = async (req, res) => {
  const { id } = req.params;

  try {
    const detalle = await MonitoreoDetalle.findByPk(id, {
      include: { model: Monitoreo, attributes: ["usuario_id"] },
    });
    if (
      !detalle ||
      (req.user.rol !== "admin" && detalle.Monitoreo.usuario_id !== req.user.id) ||
      detalle.eliminado // Si ya está eliminado
    ) {
      return res
        .status(404)
        .json({ error: "Detalle no encontrado o no autorizado" });
    }

    // Realizar el borrado lógico
    await detalle.update({ eliminado: true });
    res.json({ mensaje: "Detalle marcado como eliminado" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al eliminar detalle" });
  }
};
