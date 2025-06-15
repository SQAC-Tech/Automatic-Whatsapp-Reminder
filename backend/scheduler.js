const cron = require('node-cron');
const Reminder = require('./models/Reminder');
const sendWhatsApp = require('./utils/sendWhatsApp');

const startScheduler = () => {
  cron.schedule('* * * * *', async () => {
    const now = new Date();
    console.log(`⏰ Checking reminders at ${now.toISOString()}`);

    const reminders = await Reminder.find({
      sendDate: { $lte: now },
      sent: false
    });

    console.log(`🔎 Found ${reminders.length} reminders to send`);

    for (let reminder of reminders) {
      console.log(`📤 Sending to ${reminder.phoneNumber}: ${reminder.message}`);
      try {
        await sendWhatsApp(reminder.phoneNumber, reminder.message);
        reminder.sent = true;
        await reminder.save();
        console.log(`✅ Sent to ${reminder.phoneNumber}`);
      } catch (err) {
        console.error('❌ Error sending WhatsApp message:', err.message);
      }
    }
  });
};

module.exports = startScheduler;
