const cron = require('node-cron');
const Reminder = require('./models/Reminder');
const sendWhatsApp = require('./utils/sendWhatsApp');

const startScheduler = () => {
  cron.schedule('* * * * *', async () => {
    const now = new Date();
    const reminders = await Reminder.find({
      sendDate: { $lte: now },
      sent: false
    });

    for (let reminder of reminders) {
      try {
        await sendWhatsApp(reminder.phoneNumber, reminder.message);
        reminder.sent = true;
        await reminder.save();
        console.log(`✅ Sent: ${reminder.message}`);
      } catch (err) {
        console.error('❌ Error sending WhatsApp message:', err.message);
      }
    }
  });
};

module.exports = startScheduler;
