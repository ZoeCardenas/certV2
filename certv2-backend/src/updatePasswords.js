const bcrypt = require('bcrypt');
const Usuario = require('./models/Usuario');
const { sequelize } = require('./db/PostgreSQL');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('🔗 Conexión a la BD exitosa.');

    const updates = [
      { email: 'prueba@admin.com', password: 'admin' },
      { email: 'prueba@soporte.com', password: 'soporte' },
      { email: 'prueba@invitado.com', password: 'invitado' }
    ];

    for (const u of updates) {
      const hash = await bcrypt.hash(u.password, 10);
      const result = await Usuario.update(
        { password: hash },
        { where: { email: u.email } }
      );

      if (result[0] > 0) {
        console.log(`✅ Contraseña actualizada para: ${u.email}`);
      } else {
        console.warn(`⚠️ Usuario no encontrado: ${u.email}`);
      }
    }

    await sequelize.close();
    console.log('✅ Script completado y conexión cerrada.');
  } catch (error) {
    console.error('❌ Error actualizando contraseñas:', error);
  }
})();
