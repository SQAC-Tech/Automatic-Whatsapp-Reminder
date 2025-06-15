const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
  message: String,
  sendDate: Date,
  sent: { type: Boolean, default: false }
});

module.exports = mongoose.model('Reminder', reminderSchema);
