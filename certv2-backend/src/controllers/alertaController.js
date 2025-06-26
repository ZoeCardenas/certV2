const Alerta = require('../models/Alerta');
const Monitoreo = require('../models/Monitoreo');

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
        { model: Monitoreo, attributes: ['organizacion'] }
      ]
    });

    // Enviamos el array de medios como string separado por comas (opcional si frontend ya lo maneja como array)
    const response = alertas.map(a => ({
      ...a.toJSON(),
      enviado_por: a.enviado_por.join(', ')  // <- solo si tu frontend aún espera un string
    }));

    res.json(response);
  } catch (error) {
    console.error('Error obteniendo alertas:', error);
    res.status(500).json({ error: 'Error al obtener alertas' });
  }
};

// GET /api/alertas/:id     → detalle individual
exports.getAlerta = async (req, res) => {
  try {
    const alerta = await Alerta.findByPk(req.params.id, {
      include: [{ model: Monitoreo, attributes: ['organizacion'] }]
    });

    if (!alerta) return res.status(404).json({ error: 'Alerta no encontrada' });

    if (req.user.rol === 'analista' && alerta.usuario_id !== req.user.id) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    const alertaJSON = alerta.toJSON();
    alertaJSON.enviado_por = alerta.enviado_por.join(', ');  // <- opcional para legibilidad

    res.json(alertaJSON);
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
