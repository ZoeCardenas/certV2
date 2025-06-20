const Monitoreo = require('../models/Monitoreo');
const MonitoreoDetalle = require('../models/MonitoreoDetalle');

// GET /api/monitoreos - listar todos los monitoreos del usuario
exports.getMonitoreos = async (req, res) => {
  try {
    const lista = await Monitoreo.findAll({
      where: { usuario_id: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(lista);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener monitoreos' });
  }
};
exports.crearMonitoreo = async (req, res) => {
  const { organizacion, detalles } = req.body;

  if (!organizacion || !Array.isArray(detalles) || detalles.length === 0) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    // Crear monitoreo
    const monitoreo = await Monitoreo.create({
      organizacion,
      usuario_id: req.user.id,
      activo: true
    });

    // Insertar cada dominio/palabra
    const detallesCreados = await Promise.all(
      detalles.map(d => MonitoreoDetalle.create({
        dominio: d.dominio,
        palabra_clave: d.palabra_clave,
        monitoreo_id: monitoreo.id
      }))
    );

    res.status(201).json({
      mensaje: 'Monitoreo y detalles creados',
      monitoreo,
      detalles: detallesCreados
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear monitoreo con detalles' });
  }
};
// GET /api/monitoreos/:id - obtener monitoreo por ID
exports.getMonitoreo = async (req, res) => {
  try {
    const monitoreo = await Monitoreo.findOne({
      where: { id: req.params.id, usuario_id: req.user.id }
    });
    if (!monitoreo) return res.status(404).json({ error: 'No encontrado' });
    res.json(monitoreo);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener monitoreo' });
  }
};

// PUT /api/monitoreos/:id - actualizar monitoreo
exports.actualizarMonitoreo = async (req, res) => {
  const { organizacion, activo } = req.body;

  try {
    const actualizado = await Monitoreo.update(
      { organizacion, activo },
      { where: { id: req.params.id, usuario_id: req.user.id } }
    );
    res.json({ mensaje: 'Actualizado', actualizado });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar monitoreo' });
  }
};

// DELETE /api/monitoreos/:id - eliminar monitoreo (soft delete)
exports.eliminarMonitoreo = async (req, res) => {
  try {
    await Monitoreo.update(
      { activo: false },
      { where: { id: req.params.id, usuario_id: req.user.id } }
    );
    res.json({ mensaje: 'Monitoreo desactivado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar monitoreo' });
  }
};
