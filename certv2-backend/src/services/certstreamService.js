const WebSocket = require('ws');
const Monitoreo = require('../models/Monitoreo');
const MonitoreoDetalle = require('../models/MonitoreoDetalle');
const Alerta = require('../models/Alertas');
const Usuario = require('../models/Usuario');
const { enviarAlertaTelegram } = require('./telegramService');
const { enviarAlertaEmail } = require('./emailService');

function iniciarCertStream() {
  const ws = new WebSocket('wss://certstream.calidog.io/');

  ws.on('message', async (data) => {
    try {
      const payload = JSON.parse(data);
      if (payload.message_type !== 'certificate_update') return;

      const dominiosCert = payload.data.leaf_cert.all_domains;

      const monitoreos = await Monitoreo.findAll({
        where: { activo: true },
        include: [
          { model: MonitoreoDetalle, required: true },
          { model: Usuario, required: true }
        ]
      });

      for (const monitoreo of monitoreos) {
        for (const detalle of monitoreo.MonitoreoDetalles) {
          for (const dominioDetectado of dominiosCert) {
            const dominioMatch = dominioDetectado.includes(detalle.dominio);
            const palabraMatch = dominioDetectado.includes(detalle.palabra_clave);

            if (dominioMatch || palabraMatch) {
              await Alerta.create({
                dominio_detectado: dominioDetectado,
                palabra_clave_detectada: detalle.palabra_clave,
                enviado_por: 'telegram',
                monitoreo_id: monitoreo.id,
                usuario_id: monitoreo.Usuario.id
              });

              const mensaje = `🚨 *Alerta detectada*\n\n*Organización:* ${monitoreo.organizacion}\n*Dominio:* \`${dominioDetectado}\`\n*Palabra clave:* \`${detalle.palabra_clave}\``;

              if (monitoreo.Usuario.telegram_chat_id) {
                await enviarAlertaTelegram(mensaje, monitoreo.Usuario.telegram_chat_id);
              }

              if (monitoreo.Usuario.correo_alerta) {
                await enviarAlertaEmail(
                  monitoreo.Usuario.correo_alerta,
                  '🔔 Alerta de dominio detectado',
                  `Organización: ${monitoreo.organizacion}\nDominio: ${dominioDetectado}\nPalabra clave: ${detalle.palabra_clave}`
                );
              }

              console.log(`🔔 Alerta generada para ${monitoreo.organizacion}: ${dominioDetectado}`);
            }
          }
        }
      }

    } catch (err) {
      console.error('[CertStream ERROR]', err.message);
    }
  });

  ws.on('error', err => {
    console.error('[CertStream WebSocket Error]', err.message);
  });
}

module.exports = { iniciarCertStream };
