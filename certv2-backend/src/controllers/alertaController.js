// src/controllers/alertaController.js
const Alerta = require('../models/Alerta');  // nombre singular, coincide con tu modelo

// GET /api/alertas          → lista propias o todas según rol
exports.getAlertas = async (req, res) => {
  try {
    const where = req.user.rol === 'admin'
      ? {} 
      : { usuario_id: req.user.id };

    const alertas = await Alerta.findAll({
      where,
      order: [['created_at', 'DESC']],
      include: [
        { model: require('../models/Monitoreo'), attributes: ['organizacion'] }
      ]
    });
    res.json(alertas);
  } catch (error) {
    console.error('Error obteniendo alertas:', error);
    res.status(500).json({ error: 'Error al obtener alertas' });
  }
};

// GET /api/alertas/:id     → detalle individual
exports.getAlerta = async (req, res) => {
  try {
    const alerta = await Alerta.findByPk(req.params.id, {
      include: [{ model: require('../models/Monitoreo'), attributes: ['organizacion'] }]
    });
    if (!alerta) return res.status(404).json({ error: 'Alerta no encontrada' });
    if (req.user.rol === 'analista' && alerta.usuario_id !== req.user.id) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    res.json(alerta);
  } catch (error) {
    console.error('Error obteniendo alerta:', error);
    res.status(500).json({ error: 'Error al obtener alerta' });
  }
};

// GET /api/alertas/count   → sólo el conteo
exports.countAlertas = async (req, res) => {
  try {
    const where = req.user.rol === 'admin'
      ? {}
      : { usuario_id: req.user.id };

    const count = await Alerta.count({ where });
    res.json({ count });
  } catch (error) {
    console.error('Error contando alertas:', error);
    res.status(500).json({ error: 'Error al contar alertas' });
  }
};
