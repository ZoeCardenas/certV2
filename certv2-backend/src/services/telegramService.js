const axios = require('axios');
require('dotenv').config();

const enviarAlertaTelegram = async (mensaje, chat_id) => {
  const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id,
      text: mensaje,
      parse_mode: 'Markdown'
    });
  } catch (err) {
    console.error('[Telegram ERROR]', err.message);
  }
};

module.exports = { enviarAlertaTelegram };
