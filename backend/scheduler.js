const cron = require('node-cron');
const moment = require('moment-timezone');
const Reminder = require('./models/Reminder');
const sendWhatsApp = require('./utils/sendWhatsApp');

const startScheduler = () => {
  // Run every 30 seconds
  cron.schedule('*/30 * * * * *', async () => {
    const nowIST = moment().tz('Asia/Kolkata');
    const windowStart = nowIST.clone().subtract(30, 'seconds');
    const windowEnd = nowIST.clone().add(30, 'seconds');
    const next5Min = nowIST.clone().add(5, 'minutes');

    console.log(`⏰ Cron running at IST ${nowIST.format('YYYY-MM-DD HH:mm:ss')}`);

    // Log total reminders
    const totalReminders = await Reminder.countDocuments();
    console.log(`📦 Total reminders in DB: ${totalReminders}`);

    // Log reminders coming in the next 5 minutes
    const upcoming = await Reminder.find({
      sent: false
    }).lean();

    const upcomingFiltered = upcoming.filter(r => {
      const sendTime = moment(r.sendDate).tz('Asia/Kolkata');
      return sendTime.isAfter(nowIST) && sendTime.isSameOrBefore(next5Min);
    });

    if (upcomingFiltered.length) {
      console.log(`🔮 Reminders to be sent in next 5 minutes:`);
      upcomingFiltered.forEach(r => {
        const sendAt = moment(r.sendDate).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
        console.log(`📌 ${r.name} -> ${r.phoneNumber} at ${sendAt}`);
      });
    } else {
      console.log(`⏳ No reminders scheduled for next 5 minutes`);
    }

    // Find reminders to send **now**
    const dueReminders = upcoming.filter(r => {
      const sendTime = moment(r.sendDate).tz('Asia/Kolkata');
      return sendTime.isSameOrAfter(windowStart) &&
             sendTime.isSameOrBefore(windowEnd) &&
             !r.sent;
    });

    console.log(`🚀 Sending ${dueReminders.length} reminders due now...`);

    for (let reminder of dueReminders) {
      try {
        await sendWhatsApp(reminder.phoneNumber, reminder.message);
        await Reminder.findByIdAndUpdate(reminder._id, { sent: true });
        console.log(`✅ Sent WhatsApp to ${reminder.phoneNumber}`);
      } catch (err) {
        console.error('❌ Error sending WhatsApp message:', err.message);
      }
    }
  });
};

module.exports = startScheduler;
