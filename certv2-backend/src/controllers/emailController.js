const { enviarAlertaEmail } = require('../services/emailService');

exports.testCorreo = async (req, res) => {
  const { para, asunto, mensaje } = req.body;

  if (!para || !asunto || !mensaje) {
    return res.status(400).json({ error: 'Faltan campos para enviar correo' });
  }

  try {
    await enviarAlertaEmail(para, asunto, mensaje);
    res.json({ mensaje: 'Correo enviado con éxito' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al enviar correo' });
  }
};
