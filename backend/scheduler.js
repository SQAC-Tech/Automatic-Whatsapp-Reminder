const cron = require('node-cron');
const moment = require('moment-timezone');
const Reminder = require('./models/Reminder');
const sendWhatsApp = require('./utils/sendWhatsApp');

const startScheduler = () => {
  // Runs every 30 seconds
  cron.schedule('*/30 * * * * *', async () => {
    const nowIST = moment().tz('Asia/Kolkata');
    const windowStart = nowIST.clone().subtract(30, 'seconds');
    const windowEnd = nowIST.clone().add(30, 'seconds');
    const next5Min = nowIST.clone().add(5, 'minutes');

    console.log(`\nCron running at IST ${nowIST.format('YYYY-MM-DD HH:mm:ss')}`);

    // 1. Count total reminders
    const totalReminders = await Reminder.countDocuments();
    console.log(`Total reminders in DB: ${totalReminders}`);

    const upcoming = await Reminder.find({
      sent: false
    });

    const upcomingFiltered = upcoming.filter(r =>
      moment(r.sendDate).tz('Asia/Kolkata').isBetween(nowIST, next5Min)
    );

    if (upcomingFiltered.length > 0) {
      console.log(`🔮 Reminders to be sent in next 5 minutes:`);
      upcomingFiltered.forEach(r => {
        const timeIST = moment(r.sendDate).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
        console.log(`${r.name} -> ${r.phoneNumber} at ${timeIST}`);
      });
    } else {
      console.log(`No reminders scheduled for next 5 minutes`);
    }

    // 3. Send reminders due now
    const unsentReminders = await Reminder.find({ sent: false });
    const dueReminders = unsentReminders.filter(r => {
      const reminderTimeIST = moment(r.sendDate).tz('Asia/Kolkata');
      return reminderTimeIST.isBetween(windowStart, windowEnd);
    });

    console.log(`Sending ${dueReminders.length} reminders due now...`);

    for (let reminder of dueReminders) {
      try {
        await sendWhatsApp(reminder.phoneNumber, reminder.message);
        reminder.sent = true;
        await reminder.save();
        console.log(`Sent WhatsApp to ${reminder.phoneNumber}`);
      } catch (err) {
        console.error('Error sending WhatsApp message:', err.message);
      }
    }
  });
};

module.exports = startScheduler;
