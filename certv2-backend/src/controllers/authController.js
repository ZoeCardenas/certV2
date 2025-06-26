const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Registrar usuario
const register = async (req, res) => {
  const { nombre, email, password, rol } = req.body;

  try {
    const existe = await Usuario.findOne({ where: { email } });
    if (existe) return res.status(400).json({ error: 'Correo ya registrado' });

    const hashed = await bcrypt.hash(password, 10);

    const nuevo = await Usuario.create({
      nombre,
      email,
      password: hashed,
      rol: rol || 'analista'
    });

    const token = jwt.sign(
      { id: nuevo.id, email: nuevo.email, rol: nuevo.rol },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.status(201).json({
      token,
      rol: nuevo.rol,
      id: nuevo.id,
      nombre: nuevo.nombre,
      email: nuevo.email
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

// Login de usuario
const login = async (req, res) => {
  console.log("🧪 req.body:", req.body); // 👈 Depuración

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Faltan campos" });
  }

  try {
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) return res.status(400).json({ error: 'Credenciales inválidas' });

    const esValido = await bcrypt.compare(password, usuario.password);
    if (!esValido) return res.status(400).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.json({
      token,
      rol: usuario.rol,
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el login' });
  }
};

// Obtener perfil del usuario autenticado
const getProfile = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.user.id, {
      attributes: [
        'id',
        'nombre',
        'email',
        'rol',
        'activo',
        'telegram_token',
        'telegram_chat_id',
        'correo_alerta',
        'createdAt',
        'updatedAt'
      ]
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

module.exports = {
  register,
  login,
  getProfile
};
