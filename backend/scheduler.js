const cron = require('node-cron');
const moment = require('moment-timezone');
const Reminder = require('./models/Reminder');
const sendWhatsApp = require('./utils/sendWhatsApp');

const startScheduler = () => {
  // Schedule job to run every 30 seconds
  cron.schedule('*/30 * * * * *', async () => {
    const nowIST = moment().tz('Asia/Kolkata');
    const thirtySecondsAgo = nowIST.clone().subtract(30, 'seconds');

    console.log(`⏰ Cron running at IST ${nowIST.format('YYYY-MM-DD HH:mm:ss')}`);

    try {
      const totalReminders = await Reminder.find();
      console.log(`📦 Total reminders in DB: ${totalReminders.length}`);

      const reminders = await Reminder.find({
        sendDate: {
          $gte: thirtySecondsAgo.toDate(),
          $lte: nowIST.toDate(),
        },
        sent: false
      });

      console.log(`🔍 Found ${reminders.length} unsent reminders in time window`);

      for (let reminder of reminders) {
        try {
          await sendWhatsApp(reminder.phoneNumber, reminder.message);
          reminder.sent = true;
          await reminder.save();
          console.log(`✅ Sent WhatsApp to ${reminder.phoneNumber} (${reminder.name})`);
        } catch (err) {
          console.error('❌ Error sending WhatsApp message:', err.message);
        }
      }
    } catch (error) {
      console.error('❌ Scheduler error:', error.message);
    }
  });
};

module.exports = startScheduler;
