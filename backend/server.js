const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const reminderRoutes = require('./routes/reminderRoutes');
const startScheduler = require('./scheduler');
const sendWhatsApp = require('./utils/sendWhatsApp'); // for testing

const app = express();

app.use(cors({
  origin: 'https://automatic-whatsapp-reminder.vercel.app', // ✅ No trailing slash
}));
app.use(express.json());

app.use('/api/reminders', reminderRoutes);

// ✅ Optional: test route
app.get('/test-whatsapp', async (req, res) => {
  try {
    const phone = req.query.phone || '+919876543210';
    const msg = req.query.msg || '✅ Test message from deployed server';
    const result = await sendWhatsApp(phone, msg);
    res.status(200).json({ success: true, sid: result.sid });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI not found in .env');
  process.exit(1);
}

// ✅ Important: move scheduler inside app.listen
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      startScheduler(); // ✅ Start scheduler only after server is listening
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });
