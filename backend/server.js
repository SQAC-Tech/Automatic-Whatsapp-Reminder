const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const reminderRoutes = require('./routes/reminderRoutes');
const startScheduler = require('./scheduler');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/reminders', reminderRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    startScheduler(); // Start cron
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error(err));
  