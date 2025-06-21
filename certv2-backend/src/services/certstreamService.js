const WebSocket = require('ws');
const fs = require('fs');
const { sendTelegramAlert } = require('./telegramService');
const Monitoreo = require('../models/Monitoreo');
const MonitoreoDetalle = require('../models/MonitoreoDetalle');
const Usuario = require('../models/Usuario');

const { Op } = require('sequelize');

const CERTSTREAM_URL = 'wss://certstream.calidog.io/';
const LOG_FILE = 'alerts.log';

let monitoreosActivos = [];

async function cargarMonitoreos() {
  const datos = await Monitoreo.findAll({
    where: { activo: true },
    include: [
      { model: MonitoreoDetalle },
      { model: Usuario, attributes: ['email', 'telegram_token', 'telegram_chat_id'] }
    ]
  });

  monitoreosActivos = [];

  datos.forEach(m => {
    m.MonitoreoDetalles.forEach(d => {
      monitoreosActivos.push({
        dominio: d.dominio.toLowerCase(),
        palabra_clave: d.palabra_clave.toLowerCase(),
        organizacion: m.organizacion,
        usuario_id: m.usuario_id,
        telegram: {
          token: m.Usuario.telegram_token,
          chatId: m.Usuario.telegram_chat_id
        }
      });
    });
  });

  console.log(`✅ Monitoreos cargados: ${monitoreosActivos.length}`);
}

function logAlert(domain, organization) {
  const timestamp = new Date().toISOString();
  const log = `[${timestamp}] ORG: ${organization} | DOM: ${domain}\n`;
  fs.appendFileSync(LOG_FILE, log);
}

function startCertStreamWatcher() {
  const ws = new WebSocket(CERTSTREAM_URL);

  ws.on('open', async () => {
    console.log("🔌 Conectado a CertStream.");
    await cargarMonitoreos();

    // Refrescar cada 5 minutos los monitoreos activos
    setInterval(cargarMonitoreos, 5 * 60 * 1000);
  });

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      if (message.message_type !== 'certificate_update') return;

      const allDomains = message.data.leaf_cert.all_domains || [];

      allDomains.forEach(domain => {
        const domainLower = domain.toLowerCase();

        monitoreosActivos.forEach(config => {
          const matchDominio = domainLower.includes(config.dominio);
          const matchKeyword = domainLower.includes(config.palabra_clave);

          if (matchDominio || matchKeyword) {
            const alertMsg = `🚨 Coincidencia detectada\n🔹 Dominio: ${domain}\n🏢 Organización: ${config.organizacion}`;

            console.log(alertMsg);
            sendTelegramAlert(config.telegram.token, config.telegram.chatId, alertMsg);
            logAlert(domain, config.organizacion);
          }
        });
      });

    } catch (err) {
      console.error("❌ Error procesando mensaje:", err.message);
    }
  });

  ws.on('error', (err) => {
    console.error("❌ Error en CertStream:", err.message);
  });
}

module.exports = {
  startCertStreamWatcher,
  cargarMonitoreos // ✅ AÑADE ESTA LÍNEA
};
