/* src/controllers/monitoreoController.js
   ─────────────────────────────────────────────
   BORRADO LÓGICO CON `eliminado`  (≠  `activo`)
   • activo    → ON / OFF operativo (toggle)
   • eliminado → true = soft-delete  (oculto)
   ───────────────────────────────────────────── */
const Monitoreo        = require("../models/Monitoreo");
const MonitoreoDetalle = require("../models/MonitoreoDetalle");
const { cargarMonitoreos } = require("../services/certstreamService");

/* helper: filtra por usuario cuando no es admin */
const filtByUser = (req) =>
  req.user.rol === "admin" ? {} : { usuario_id: req.user.id };

/* helper: sólo los que NO están eliminados */
const notDeleted = { eliminado: false };

/* ══════════════════════════════════════════════
   LISTADOS
   ══════════════════════════════════════════════ */
exports.getMonitoreos = async (req, res) => {
  try {
    const lista = await Monitoreo.findAll({
      where: { ...filtByUser(req), ...notDeleted },
      order: [["createdAt", "DESC"]],
    });
    res.json(lista);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al obtener monitoreos" });
  }
};

exports.getTodosMonitoreos = async (_req, res) => {
  try {
    const lista = await Monitoreo.findAll({
      where: notDeleted,
      order: [["createdAt", "DESC"]],
    });
    res.json(lista);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al obtener todos los monitoreos" });
  }
};

/* dominios de monitoreos que siguen vigentes (no eliminados) */
/* dominios de monitoreos que siguen vigentes (no eliminados) */
exports.getDominios = async (req, res) => {
  try {
    // Si el usuario no es admin, solo le mostramos sus dominios
    const filter = req.user.rol === "analista" ? { usuario_id: req.user.id } : {};

    const dominios = await MonitoreoDetalle.findAll({
      include: {
        model: Monitoreo,
        attributes: ["organizacion", "activo"],
        where: { ...notDeleted, ...filter },  // Filtra por usuario_id si es analista
      },
      order: [["createdAt", "DESC"]],
    });

    res.json(dominios);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al obtener dominios" });
  }
};

/* ══════════════════════════════════════════════
   DETALLES POR MONITOREO
   ══════════════════════════════════════════════ */
/* ══════════════════════════════════════════════
   DETALLES POR MONITOREO
   ══════════════════════════════════════════════ */
exports.getDominiosByMonitoreo = async (req, res) => {
  try {
    const { id } = req.params;

    /* Si no es admin, validar propiedad y NO eliminado */
    if (req.user.rol !== "admin") {
      const propio = await Monitoreo.findOne({
        where: { id, ...filtByUser(req), ...notDeleted },
      });
      if (!propio) return res.status(403).json({ error: "Acceso denegado" });
    }

    const detalles = await MonitoreoDetalle.findAll({
      where: { monitoreo_id: id, eliminado: false },
      include: {
        model: Monitoreo,
        attributes: ['organizacion'], // Aquí nos aseguramos de incluir la organización del monitoreo
      },
      order: [["createdAt", "DESC"]],
    });

    // Mapeamos la información para asegurarnos de que esté bien estructurada
    const response = detalles.map(detalle => ({
      id: detalle.id,
      dominio: detalle.dominio,
      palabra_clave: detalle.palabra_clave,
      organizacion: detalle.Monitoreo.organizacion,  // Incluimos la organización
      createdAt: detalle.createdAt,
      activo: detalle.Monitoreo.activo,
    }));

    res.json(response);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al obtener detalles" });
  }
};

/* ══════════════════════════════════════════════
   CREAR
   ══════════════════════════════════════════════ */
exports.crearMonitoreo = async (req, res) => {
  const { organizacion, detalles } = req.body;
  if (!organizacion || !Array.isArray(detalles) || !detalles.length)
    return res.status(400).json({ error: "Faltan campos obligatorios" });

  try {
    const monitoreo = await Monitoreo.create({
      organizacion,
      usuario_id: req.user.id,
      activo: true,
      eliminado: false,
    });

    await Promise.all(
      detalles.map((d) =>
        MonitoreoDetalle.create({
          dominio:        d.dominio,
          palabra_clave:  d.palabra_clave,
          monitoreo_id:   monitoreo.id,
        })
      )
    );

    await cargarMonitoreos();
    res.status(201).json({ mensaje: "Monitoreo creado", monitoreo });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al crear monitoreo" });
  }
};

/* ══════════════════════════════════════════════
   OBTENER / ACTUALIZAR
   ══════════════════════════════════════════════ */
exports.getMonitoreo = async (req, res) => {
  try {
    const m = await Monitoreo.findOne({
      where: { id: req.params.id, ...filtByUser(req), ...notDeleted },
    });
    if (!m) return res.status(404).json({ error: "No encontrado" });
    res.json(m);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al obtener monitoreo" });
  }
};

exports.actualizarMonitoreo = async (req, res) => {
  try {
    const [n] = await Monitoreo.update(
      { organizacion: req.body.organizacion, activo: req.body.activo },
      { where: { id: req.params.id, ...filtByUser(req), ...notDeleted } }
    );
    if (!n) return res.status(404).json({ error: "No encontrado" });
    await cargarMonitoreos();
    res.json({ mensaje: "Actualizado" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al actualizar monitoreo" });
  }
};

/* ══════════════════════════════════════════════
   SOFT-DELETE = eliminado:true  + activo:false
   ══════════════════════════════════════════════ */
exports.eliminarMonitoreo = async (req, res) => {
  try {
    const [n] = await Monitoreo.update(
      { eliminado: true, activo: false },
      { where: { id: req.params.id, ...filtByUser(req), ...notDeleted } }
    );
    if (!n) return res.status(404).json({ error: "No encontrado" });

    await cargarMonitoreos();
    res.json({ mensaje: "Monitoreo eliminado (soft-delete)" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al eliminar monitoreo" });
  }
};

/* ══════════════════════════════════════════════
   TOGGLE activo (solo si NO está eliminado)
   ══════════════════════════════════════════════ */
exports.toggleMonitoreo = async (req, res) => {
  try {
    const m = await Monitoreo.findOne({
      where: { id: req.params.id, ...filtByUser(req), ...notDeleted },
    });
    if (!m) return res.status(404).json({ error: "Monitoreo no encontrado" });

    m.activo = !m.activo;
    await m.save();
    await cargarMonitoreos(); // Verifica que esta función recargue los monitoreos de forma correcta
    res.json({ mensaje: `Monitoreo ${m.activo ? "activado" : "desactivado"}` });
  } catch (e) {
    console.error('Error al cambiar estado de monitoreo:', e);
    res.status(500).json({ error: "Error al cambiar estado del monitoreo" });
  }
};
