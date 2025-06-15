const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendWhatsApp = async (to, message) => {
  try {
    const res = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${to}`,
      body: message
    });
    console.log(' WhatsApp sent successfully. SID:', res.sid);
    console.log(' To:', to);
    console.log(' Message:', message);
    return res;
  } catch (error) {
    console.error(' Error sending WhatsApp message');
    console.error(' To:', to);
    console.error(' Message:', message);
    console.error(' Error Details:', error.message);
    throw error;
  }
};

module.exports = sendWhatsApp;
