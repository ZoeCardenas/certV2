const { sequelize } = require('./PostgreSQL');

// Importar modelos (asegúrate que estas rutas son correctas)
require('../models/Usuario');
require('../models/Monitoreo');
require('../models/MonitoreoDetalle');
require('../models/Alerta');

(async () => {
  try {
    console.log('🔄 Sincronizando tablas en la base de datos certv2...');
    
    // Alternativas:
    // await sequelize.sync({ force: true });  // Borra y recrea todo
    // await sequelize.sync({ alter: true });  // Solo ajusta estructuras
    await sequelize.sync({ alter: true });

    console.log('✅ ¡Todas las tablas fueron sincronizadas correctamente!');
    await sequelize.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error al sincronizar tablas:', err);
    await sequelize.close();
    process.exit(1);
  }
})();
