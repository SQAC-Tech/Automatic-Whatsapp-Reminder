const sendWhatsApp = async (to, message) => {
  try {
    const res = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${to}`,
      body: message
    });
    console.log('✅ WhatsApp sent:', res.sid);
    return res;
  } catch (error) {
    console.error('❌ WhatsApp send error:', error.message);
    throw error;
  }
};
