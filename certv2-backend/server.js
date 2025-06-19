const app = require('./app');
const { connectDB } = require('./config/db');
const startCertStream = require('./services/certstreamService');

const PORT = process.env.PORT || 4000;

async function init() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 API backend corriendo en http://localhost:${PORT}`);
    startCertStream(); // comienza a escuchar en tiempo real
  });
}

init();
