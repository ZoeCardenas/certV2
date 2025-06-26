const app = require('./src/app');
const { connectDB } = require('./src/db/PostgreSQL');
const { startCertStreamWatcher } = require('./src/services/certstreamService');

const PORT = process.env.PORT || 4000;

async function init() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 API backend corriendo en http://localhost:${PORT}`);
    startCertStreamWatcher();
  });
}

init();
