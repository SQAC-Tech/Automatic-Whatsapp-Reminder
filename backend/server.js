const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const reminderRoutes = require('./routes/reminderRoutes');
const startScheduler = require('./scheduler');
const sendWhatsApp = require('./utils/sendWhatsApp'); // for testing

const app = express();

// Middlewares
app.use(cors({
  origin: 'https://automatic-whatsapp-reminder.vercel.app/',
}));
app.use(express.json());

// API routes
app.use('/api/reminders', reminderRoutes);

// ✅ Optional test route — REMOVE in production
app.get('/test-whatsapp', async (req, res) => {
  try {
    const phone = req.query.phone || '+919876543210'; // test number
    const msg = req.query.msg || '✅ Test WhatsApp message from deployed server';
    const result = await sendWhatsApp(phone, msg);
    res.status(200).json({ success: true, sid: result.sid });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// MongoDB Connection + Server start
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI not found in .env');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    startScheduler(); // Start cron after DB is connected
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });
