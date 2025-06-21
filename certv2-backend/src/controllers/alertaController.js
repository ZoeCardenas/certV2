const Alerta = require('../models/Alerta');
const Monitoreo = require('../models/Monitoreo');

// GET /api/alertas/
exports.getAlertas = async (req, res) => {
  try {
    const alertas = await Alerta.findAll({
      where: { usuario_id: req.user.id },
      order: [['created_at', 'DESC']],
      include: [{ model: Monitoreo, attributes: ['organizacion'] }]
    });

    res.json(alertas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener alertas' });
  }
};

// GET /api/alertas/:id
exports.getAlerta = async (req, res) => {
  try {
    const alerta = await Alerta.findOne({
      where: {
        id: req.params.id,
        usuario_id: req.user.id
      },
      include: [{ model: Monitoreo, attributes: ['organizacion'] }]
    });

    if (!alerta) return res.status(404).json({ error: 'Alerta no encontrada' });

    res.json(alerta);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener la alerta' });
  }
};
