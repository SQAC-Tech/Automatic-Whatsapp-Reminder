const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');

// Add Reminder
router.post('/', async (req, res) => {
  try {
    const reminder = new Reminder(req.body);
    await reminder.save();
    res.status(201).json(reminder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Reminders
router.get('/', async (req, res) => {
  const reminders = await Reminder.find();
  res.json(reminders);
});

// Delete 
router.delete('/:id', async (req, res) => {
  await Reminder.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
