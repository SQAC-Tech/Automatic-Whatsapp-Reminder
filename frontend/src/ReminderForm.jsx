import React, { useState } from 'react';
import axios from 'axios';

const ReminderForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    message: '',
    sendDate: ''
  });

  const API_BASE_URL = import.meta.env.VITE_API_URL; // ✅ Load from .env

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "sendDate") {
      const localDate = new Date(value);
      const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
      setFormData({ ...formData, [name]: utcDate.toISOString() });

      console.log("🕒 Local:", value);
      console.log("🌐 UTC Converted:", utcDate.toISOString());
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/reminders`, formData);
      alert('✅ Reminder Scheduled!');
      console.log("🔗 Using API Base URL:", API_BASE_URL);
      setFormData({ name: '', phoneNumber: '', message: '', sendDate: '' });
    } catch (err) {
      alert('❌ Error scheduling reminder');
      console.error(err); // Optional: for debugging
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        📅 Schedule WhatsApp Reminder
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          name="phoneNumber"
          type="text"
          placeholder="Phone Number (e.g. +919876543210)"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <textarea
          name="message"
          placeholder="Reminder message"
          value={formData.message}
          onChange={handleChange}
          required
          rows="4"
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          name="sendDate"
          type="datetime-local"
          value={formData.sendDate}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
        >
          Schedule Reminder
        </button>
      </form>
    </div>
  );
};

export default ReminderForm;
