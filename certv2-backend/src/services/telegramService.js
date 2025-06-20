const axios = require('axios');
require('dotenv').config();

const enviarAlertaTelegram = async (mensaje) => {
  const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text: mensaje,
      parse_mode: 'Markdown'
    });
  } catch (err) {
    console.error('Error al enviar alerta por Telegram:', err.message);
  }
};

module.exports = { enviarAlertaTelegram };
