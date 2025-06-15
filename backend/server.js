const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const reminderRoutes = require('./routes/reminderRoutes');
const startScheduler = require('./scheduler');
const sendWhatsApp = require('./utils/sendWhatsApp'); // for testing
const authRoutes = require('./routes/auth.route');

const app = express();

app.use(cors({
  origin: [
    'https://automatic-whatsapp-reminder.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true,
}));
app.use(express.json());

app.use('/api/reminders', reminderRoutes);
app.use('/api', authRoutes); 

// ✅ Dummy route to keep server awake
app.get('/ping', (req, res) => {
  res.status(200).json({ message: '✅ Server is awake!' });
});

// ✅ WhatsApp test route (optional)
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

app.post('/api/logout', (req, res) => {
  res.clearCookie('access_token').json({ message: 'Logged out' });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI not found in .env');
  process.exit(1);
}

// ✅ Start server and scheduler
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);

      startScheduler(); // ✅ Start cron after server is ready

      // 🔁 Self-ping every 10 minutes to prevent Render from sleeping
      setInterval(() => {
        axios.get('https://automatic-whatsapp-reminder.onrender.com/ping')
          .then(res => {
            console.log('🔁 Self-ping:', res.data.message);
          })
          .catch(err => {
            console.error('❌ Self-ping failed:', err.message);
          });
      }, 10 * 60 * 1000); // 10 minutes
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });
