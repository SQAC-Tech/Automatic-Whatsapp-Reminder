const cron = require('node-cron');
const moment = require('moment-timezone');
const Reminder = require('./models/Reminder');
const sendWhatsApp = require('./utils/sendWhatsApp');

const startScheduler = () => {
  // Run every 30 seconds
  cron.schedule('*/30 * * * * *', async () => {
    const nowIST = moment().tz('Asia/Kolkata');
    const nowUTC = nowIST.clone().utc();
    const windowStart = nowUTC.clone().subtract(30, 'seconds');
    const windowEnd = nowUTC.clone().add(30, 'seconds');
    const next5Min = nowUTC.clone().add(5, 'minutes');

    console.log(`⏰ Cron running at IST ${nowIST.format('YYYY-MM-DD HH:mm:ss')}`);

    // Log total reminders
    const totalReminders = await Reminder.countDocuments();
    console.log(`📦 Total reminders in DB: ${totalReminders}`);

    // Log reminders coming in the next 5 minutes
    const upcoming = await Reminder.find({
      sendDate: { $gt: nowUTC.toDate(), $lte: next5Min.toDate() },
      sent: false,
    });

    if (upcoming.length) {
      console.log(`🔮 Reminders to be sent in next 5 minutes:`);
      upcoming.forEach(r => {
        console.log(`📌 ${r.name} -> ${r.phoneNumber} at ${moment(r.sendDate).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss')}`);
      });
    } else {
      console.log(`⏳ No reminders scheduled for next 5 minutes`);
    }

    // Find reminders to send **now**
    const remindersToSend = await Reminder.find({
      sendDate: { $gte: windowStart.toDate(), $lte: windowEnd.toDate() },
      sent: false,
    });

    console.log(`🚀 Sending ${remindersToSend.length} reminders due now...`);

    for (let reminder of remindersToSend) {
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
