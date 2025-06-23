const Monitoreo        = require("../models/Monitoreo");
const MonitoreoDetalle = require("../models/MonitoreoDetalle");
const { cargarMonitoreos } = require("../services/certstreamService");

/* ──────────────────────────────
   Analista → /api/monitoreos
──────────────────────────────── */
exports.getMonitoreos = async (req, res) => {
  try {
    const lista = await Monitoreo.findAll({
      where: { usuario_id: req.user.id, activo: true },
      order: [["createdAt", "DESC"]],
    });
    res.json(lista);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener monitoreos" });
  }
};

/* ──────────────────────────────
   Admin → /api/monitoreos/todos
──────────────────────────────── */
exports.getTodosMonitoreos = async (_req, res) => {
  try {
    const lista = await Monitoreo.findAll({ order: [["createdAt", "DESC"]] });
    res.json(lista);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener todos los monitoreos" });
  }
};

/* ──────────────────────────────
   Admin → /api/monitoreos/dominios/todos
──────────────────────────────── */
exports.getDominios = async (_req, res) => {
  try {
    const dominios = await MonitoreoDetalle.findAll({
      include: { model: Monitoreo, attributes: ["organizacion"] },
      order: [["createdAt", "DESC"]],
    });
    res.json(dominios);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener dominios" });
  }
};

/* ──────────────────────────────
   Analista/Admin → /api/monitoreos/:id/detalles
──────────────────────────────── */
exports.getDominiosByMonitoreo = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.rol !== "admin") {
      const propio = await Monitoreo.findOne({
        where: { id, usuario_id: req.user.id },
      });
      if (!propio) return res.status(403).json({ error: "Acceso denegado" });
    }

    const detalles = await MonitoreoDetalle.findAll({
      where: { monitoreo_id: id },
      order: [["createdAt", "DESC"]],
    });
    res.json(detalles);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener detalles" });
  }
};

/* ──────────────────────────────
   POST /api/monitoreos
──────────────────────────────── */
exports.crearMonitoreo = async (req, res) => {
  const { organizacion, detalles } = req.body;
  if (!organizacion || !Array.isArray(detalles) || !detalles.length) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  try {
    const monitoreo = await Monitoreo.create({
      organizacion,
      usuario_id: req.user.id,
      activo: true,
    });

    const detallesCreados = await Promise.all(
      detalles.map((d) =>
        MonitoreoDetalle.create({
          dominio: d.dominio,
          palabra_clave: d.palabra_clave,
          monitoreo_id: monitoreo.id,
        })
      )
    );

    await cargarMonitoreos(); // recarga watcher
    res.status(201).json({ mensaje: "Monitoreo y detalles creados", monitoreo, detalles: detallesCreados });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear monitoreo" });
  }
};

/* ──────────────────────────────
   GET /api/monitoreos/:id
──────────────────────────────── */
exports.getMonitoreo = async (req, res) => {
  try {
    const m = await Monitoreo.findOne({
      where: { id: req.params.id, usuario_id: req.user.id },
    });
    if (!m) return res.status(404).json({ error: "No encontrado" });
    res.json(m);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener monitoreo" });
  }
};

/* ──────────────────────────────
   PUT /api/monitoreos/:id
──────────────────────────────── */
exports.actualizarMonitoreo = async (req, res) => {
  const { organizacion, activo } = req.body;
  try {
    const actualizado = await Monitoreo.update(
      { organizacion, activo },
      { where: { id: req.params.id, usuario_id: req.user.id } }
    );
    res.json({ mensaje: "Actualizado", actualizado });
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar monitoreo" });
  }
};

/* ──────────────────────────────
   DELETE /api/monitoreos/:id  (soft)
──────────────────────────────── */
exports.eliminarMonitoreo = async (req, res) => {
  try {
    await Monitoreo.update(
      { activo: false },
      { where: { id: req.params.id, usuario_id: req.user.id } }
    );
    res.json({ mensaje: "Monitoreo desactivado" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar monitoreo" });
  }
};

/* ──────────────────────────────
   PATCH /api/monitoreos/:id/toggle
──────────────────────────────── */
exports.toggleMonitoreo = async (req, res) => {
  try {
    const m = await Monitoreo.findOne({
      where: { id: req.params.id, usuario_id: req.user.id },
    });
    if (!m) return res.status(404).json({ error: "No encontrado" });

    m.activo = !m.activo;
    await m.save();
    res.json({ mensaje: `Monitoreo ${m.activo ? "activado" : "desactivado"}`, monitoreo: m });
  } catch (err) {
    res.status(500).json({ error: "Error al cambiar estado" });
  }
};
