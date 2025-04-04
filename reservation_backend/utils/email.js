const nodemailer = require('nodemailer');
 const transporter = nodemailer.createTransport({
         host: process.env.SMTP_HOST,
         port: process.env.SMTP_PORT,
         secure: process.env.SMTP_SECURE === 'true',
         auth: {
             user: process.env.SMTP_USER,
             pass: process.env.SMTP_PASS,

     },
 });
 const sendEmail = async ({ to, subject, text }) => {

    const mailOptions = {
                 from: process.env.SMTP_FROM,
                 to,
                 subject,
                 text,

          };
          try {
            await transporter.sendMail(mailOptions);
            console.log(`Email envoyé → To: ${to} | Sujet: ${subject}`);
        } catch (error) {
            console.error('Erreur lors de l\'envoi de l\'email :', error);
        }
    };
module.exports = sendEmail;
