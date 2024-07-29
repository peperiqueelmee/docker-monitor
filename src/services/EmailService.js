const nodemailer = require('nodemailer');
const { EMAIL_CONFIG } = require('../config/emailConfig');
const path = require('path');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: EMAIL_CONFIG.host,
      port: EMAIL_CONFIG.port,
      secure: false,
      auth: {
        user: EMAIL_CONFIG.user,
        pass: EMAIL_CONFIG.pass,
      },
    });
  }

  async sendEmail(to, subject, htmlContent) {
    const mailOptions = {
      from: EMAIL_CONFIG.user,
      to: to,
      subject: subject,
      html: htmlContent,
      attachments: [
        {
          filename: 'docker-banner.png',
          path: path.join(__dirname, '../assets/docker-banner.png'),
          cid: 'docker-banner',
        },
      ],
    };

    return this.transporter.sendMail(mailOptions);
  }
}

module.exports = new EmailService();
