const db = require('./PostgreSQL');

// Importar modelos para que Sequelize los registre
require('../models/Usuario');
require('../models/Monitoreo');
require('../models/MonitoreoDetalle');
require('../models/Alertas');

(async () => {
  try {
    await db.sync({ alter: true }); // O usa { force: true } para borrar y crear todo
    console.log('✅ Tablas sincronizadas correctamente.');
    process.exit();
  } catch (err) {
    console.error('❌ Error al sincronizar tablas:', err);
    process.exit(1);
  }
})();
