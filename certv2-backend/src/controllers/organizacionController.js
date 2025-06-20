const Organizacion = require('../models/Organizacion');

exports.crearOrganizacion = async (req, res) => {
  const { nombre, dominios, palabrasClave, telegramChatId } = req.body;

  try {
    const org = await Organizacion.create({ nombre, dominios, palabrasClave, telegramChatId });
    res.json(org);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear organización' });
  }
};
