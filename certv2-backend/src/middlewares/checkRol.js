// middlewares/checkRol.js
module.exports = function (rolesPermitidos = []) {
  return (req, res, next) => {
    try {
      const rol = req.user.rol;

      if (!rolesPermitidos.includes(rol)) {
        return res.status(403).json({ error: 'Acceso denegado. Rol insuficiente' });
      }

      next();
    } catch (err) {
      console.error('Error en verificación de rol:', err);
      res.status(500).json({ error: 'Error interno de autorización' });
    }
  };
};
