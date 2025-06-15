const cron = require('node-cron');
const moment = require('moment-timezone');
const Reminder = require('./models/Reminder');
const sendWhatsApp = require('./utils/sendWhatsApp');

const startScheduler = () => {
  cron.schedule('*/30 * * * * *', async () => {
    const nowIST = moment().tz('Asia/Kolkata').format('YYYY-MM-DDTHH:mm');
    console.log(`⏰ Cron running at IST ${nowIST}`);

    const currentDate = moment.tz(nowIST, 'Asia/Kolkata').toDate();

    const reminders = await Reminder.find({
      sendDate: { $lte: currentDate },
      sent: false
    });

    console.log(`🔍 Found ${reminders.length} unsent reminders`);

    for (let reminder of reminders) {
      try {
        await sendWhatsApp(reminder.phoneNumber, reminder.message);
        reminder.sent = true;
        await reminder.save();
        console.log(`✅ Sent WhatsApp to ${reminder.phoneNumber}`);
      } catch (err) {
        console.error('❌ Error sending WhatsApp message:', err.message);
      }
    }
  });
};

module.exports = startScheduler;
