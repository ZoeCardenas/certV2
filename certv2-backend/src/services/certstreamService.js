// src/services/certstreamService.js
const WebSocket = require('ws');
const fs = require('fs');
const { sendTelegramAlert } = require('./telegramService');
const Monitoreo = require('../models/Monitoreo');
const MonitoreoDetalle = require('../models/MonitoreoDetalle');
const Usuario = require('../models/Usuario');

const CERTSTREAM_URL = 'wss://certstream.calidog.io/';
const LOG_FILE = 'alerts.log';

let monitoreosActivos = [];

/**
 * Carga todos los detalles de monitoreo activos junto con su usuario.
 * Solo añade aquellos que tengan telegram_token y telegram_chat_id válidos.
 */
async function cargarMonitoreos() {
  const datos = await Monitoreo.findAll({
    where: { activo: true },
    include: [
      { model: MonitoreoDetalle },
      { model: Usuario, attributes: ['telegram_token', 'telegram_chat_id'] }
    ]
  });

  monitoreosActivos = [];

  datos.forEach(m => {
    // Si el monitoreo no tiene usuario o no tiene tokens, lo reportamos y saltamos
    if (!m.Usuario) {
      console.warn(`⚠️ Monitoreo ${m.id} sin Usuario asociado, se omite.`);
      return;
    }
    const { telegram_token: token, telegram_chat_id: chatId } = m.Usuario;
    if (!token || !chatId) {
      console.warn(`⚠️ Usuario ${m.usuario_id} sin telegram_token/chatId, se omite.`);
      return;
    }

    // Por cada detalle válido, añadimos la configuración
    m.MonitoreoDetalles.forEach(d => {
      monitoreosActivos.push({
        detalleId: d.id,
        dominio: d.dominio.toLowerCase(),
        palabra_clave: d.palabra_clave.toLowerCase(),
        organizacion: m.organizacion,
        telegram: { token, chatId }
      });
    });
  });

  console.log(`✅ Monitoreos cargados: ${monitoreosActivos.length}`);
}

/**
 * Registra en archivo de log cada alerta.
 */
function logAlert(domain, organization) {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] ORG: ${organization} | DOM: ${domain}\n`;
  fs.appendFileSync(LOG_FILE, line);
}

/**
 * Inicia la escucha en CertStream y dispara alertas por Telegram.
 */
function startCertStreamWatcher() {
  const ws = new WebSocket(CERTSTREAM_URL);

  ws.on('open', async () => {
    console.log("🔌 Conectado a CertStream.");
    await cargarMonitoreos();
    // Refresca cada 5 minutos
    setInterval(cargarMonitoreos, 5 * 60 * 1000);
  });

  ws.on('message', (data) => {
    let message;
    try {
      message = JSON.parse(data);
    } catch {
      return;
    }
    if (message.message_type !== 'certificate_update') return;

    const allDomains = message.data.leaf_cert.all_domains || [];
    allDomains.forEach(domain => {
      const domLower = domain.toLowerCase();

      monitoreosActivos.forEach(cfg => {
        if (
          domLower.includes(cfg.dominio) ||
          domLower.includes(cfg.palabra_clave)
        ) {
          const text =
            `🚨 *Alerta* 🚨\n` +
            `🏢 *Organización:* ${cfg.organizacion}\n` +
            `🌐 *Dominio detectado:* ${domain}\n` +
            `🔑 *Palabra clave:* ${cfg.palabra_clave}`;

          // Envía por Telegram
          sendTelegramAlert(cfg.telegram.token, cfg.telegram.chatId, text)
            .then(() => console.log(`✅ Enviado alerta para detalle ${cfg.detalleId}`))
            .catch(err =>
              console.error(`❌ Error enviando a ${cfg.telegram.chatId}:`, err.message)
            );

          // Lo logueamos localmente
          logAlert(domain, cfg.organizacion);
        }
      });
    });
  });

  ws.on('error', err => {
    console.error("❌ Error en WebSocket CertStream:", err.message);
  });

  ws.on('close', () => {
    console.log("⚠️ CertStream desconectado, reconectando en 5s...");
    setTimeout(startCertStreamWatcher, 5000);
  });
}

module.exports = {
  startCertStreamWatcher,
  cargarMonitoreos
};
