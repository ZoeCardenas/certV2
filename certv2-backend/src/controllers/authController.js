const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.register = async (req, res) => {
  const { nombre, email, password } = req.body;

  try {
    // Verifica si ya existe el usuario
    const existe = await Usuario.findOne({ where: { email } });
    if (existe) return res.status(400).json({ error: 'Correo ya registrado' });

    // Encripta la contraseña
    const hashed = await bcrypt.hash(password, 10);

    // Crea el nuevo usuario
    const nuevo = await Usuario.create({
      nombre,
      email,
      password: hashed
    });

    // Genera token JWT
    const token = jwt.sign({ id: nuevo.id, email }, process.env.JWT_SECRET, {
      expiresIn: '12h'
    });

    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
  exports.getProfile = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.user.id, {
      attributes: { exclude: ['password'] } // No enviamos la contraseña
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(usuario);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};

};
