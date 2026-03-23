const transporter = require('../config/mailer');

/**
 * Gửi email qua Nodemailer (Mailtrap for dev)
 * @param {{ to: string, subject: string, html: string }} options
 */
const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `"Luxury Watch Store" <noreply@luxurywatch.vn>`,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
