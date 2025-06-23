const Configuracion = require('../models/Usuario');

// GET /configuracion
exports.obtenerConfiguracion = async (req, res) => {
  try {
    const config = await Configuracion.findOne({ where: { userId: req.user.id } });
    res.json(config || {});
  } catch (error) {
    console.error('Error al obtener configuración:', error);
    res.status(500).json({ error: 'Error al obtener configuración' });
  }
};
const Usuario = require('../models/Usuario');

exports.actualizarConfiguracion = async (req, res) => {
  try {
    const userId = req.user.id;
    const { correo_alerta, telegram_token, telegram_chat_id } = req.body;

    const usuario = await Usuario.findByPk(userId);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    usuario.correo_alerta = correo_alerta ?? usuario.correo_alerta;
    usuario.telegram_token = telegram_token ?? usuario.telegram_token;
    usuario.telegram_chat_id = telegram_chat_id ?? usuario.telegram_chat_id;

    await usuario.save();

    res.json({ mensaje: 'Configuración actualizada correctamente', usuario });
  } catch (err) {
    console.error('❌ Error al actualizar configuración:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

