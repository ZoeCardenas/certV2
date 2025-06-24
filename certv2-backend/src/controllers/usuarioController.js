// src/controllers/usuarioController.js
const Usuario = require('../models/Usuario');

// Obtener el conteo de usuarios
exports.countUsuarios = async (req, res) => {
  try {
    const count = await Usuario.count();
    res.json({ count });
  } catch (error) {
    console.error('Error contando usuarios:', error);
    res.status(500).json({ error: 'Error al obtener conteo de usuarios' });
  }
};

// Listar todos los usuarios
exports.getAllUsers = async (req, res) => {
  try {
    const users = await Usuario.findAll({
      attributes: ['id', 'nombre', 'email', 'rol', 'createdAt', 'updatedAt']
    });
    res.json(users);
  } catch (error) {
    console.error('Error listando usuarios:', error);
    res.status(500).json({ error: 'Error al listar usuarios' });
  }
};

// Obtener un usuario por ID
exports.getUserById = async (req, res) => {
  try {
    const user = await Usuario.findByPk(req.params.id, {
      attributes: ['id', 'nombre', 'email', 'rol', 'createdAt', 'updatedAt']
    });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
};

// Actualizar datos de un usuario (incluyendo rol)
exports.updateUser = async (req, res) => {
  const { nombre, email, rol } = req.body;
  try {
    const user = await Usuario.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Solo admin puede cambiar rol
    if (rol && req.user.rol !== 'admin') {
      return res.status(403).json({ error: 'No autorizado para cambiar rol' });
    }

    user.nombre = nombre ?? user.nombre;
    user.email = email ?? user.email;
    if (rol) user.rol = rol;
    await user.save();

    res.json({ message: 'Usuario actualizado', user });
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

// Eliminar usuario (hard delete)
exports.deleteUser = async (req, res) => {
  try {
    const user = await Usuario.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    await user.destroy();
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};

