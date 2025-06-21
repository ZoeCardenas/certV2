const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASSWORD
  }
});

const enviarAlertaEmail = async (para, asunto, texto) => {
  const mailOptions = {
    from: `"CertV2 Alerts" <${process.env.EMAIL_FROM}>`,
    to: para,
    subject: asunto,
    text: texto
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Correo enviado a ${para}`);
  } catch (error) {
    console.error('❌ Error al enviar correo:', error.message);
  }
};

module.exports = { enviarAlertaEmail };
