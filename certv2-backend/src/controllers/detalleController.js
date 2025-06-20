const MonitoreoDetalle = require('../models/MonitoreoDetalle');
const Monitoreo = require('../models/Monitoreo');

// GET /api/monitoreos/:id/detalles
exports.obtenerDetalles = async (req, res) => {
  const monitoreoId = req.params.id;

  try {
    // Validar que ese monitoreo sea del usuario
    const monitoreo = await Monitoreo.findOne({
      where: { id: monitoreoId, usuario_id: req.user.id }
    });
    if (!monitoreo) return res.status(404).json({ error: 'Monitoreo no encontrado o no autorizado' });

    // Obtener detalles
    const detalles = await MonitoreoDetalle.findAll({
      where: { monitoreo_id: monitoreoId }
    });

    res.json(detalles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener detalles' });
  }
};

// DELETE /api/detalles/:id
exports.eliminarDetalle = async (req, res) => {
  const detalleId = req.params.id;

  try {
    const detalle = await MonitoreoDetalle.findByPk(detalleId, {
      include: {
        model: Monitoreo,
        where: { usuario_id: req.user.id }
      }
    });

    if (!detalle) return res.status(404).json({ error: 'Detalle no encontrado o no autorizado' });

    await MonitoreoDetalle.destroy({ where: { id: detalleId } });
    res.json({ mensaje: 'Detalle eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar detalle' });
  }
};
