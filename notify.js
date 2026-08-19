const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function notifySalesperson(inquiry, { category, summary }) {
  await resend.emails.send({
    from: process.env.NOTIFY_EMAIL_FROM,
    to: process.env.NOTIFY_EMAIL_TO,
    subject: `New inquiry [${category}]: ${inquiry.name}`,
    text: `New daycare inquiry received.

Category: ${category}
Summary: ${summary}

Name: ${inquiry.name}
Phone: ${inquiry.phone || 'not provided'}
Email: ${inquiry.email || 'not provided'}

Full message:
${inquiry.message}
`,
  });
}

module.exports = { notifySalesperson };

/*
To send WhatsApp instead of (or alongside) email, use Twilio's WhatsApp
API in this same function. It needs a Twilio account, an approved
WhatsApp sender, and the 'twilio' npm package:

const twilioClient = require('twilio')(accountSid, authToken);
await twilioClient.messages.create({
  from: 'whatsapp:+14155238886',
  to: `whatsapp:${salespersonPhoneNumber}`,
  body: `New inquiry [${category}]: ${summary}`,
});
*/
