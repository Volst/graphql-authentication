const { createTransport } = require('nodemailer');
const mailgun = require('nodemailer-mailgun-transport');
const Email = require('email-templates');

const apiKey = process.env.MAILGUN_API_KEY;

const mailgunConfig = {
  auth: {
    api_key: apiKey,
    domain: process.env.MAILGUN_DOMAIN
  }
};

// Just send the email locally if apikey is not filled in
const transporter = apiKey
  ? createTransport(mailgun(mailgunConfig))
  : undefined;

email = new Email({
  message: {
    from: process.env.MAIL_FROM
  },
  send: true,
  transport: transporter
});

module.exports = { email };
