const { sequelize } = require('./PostgreSQL');

// Importar modelos
require('../models/Usuario');
require('../models/Monitoreo');
require('../models/MonitoreoDetalle');
require('../models/Alerta');

(async () => {
  try {
    await sequelize.sync({ alter: true }); // O usa { force: true } si quieres reiniciar todo
    console.log('✅ Tablas sincronizadas correctamente.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error al sincronizar tablas:', err);
    process.exit(1);
  }
})();
