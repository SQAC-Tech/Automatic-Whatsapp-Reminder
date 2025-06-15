import React, { useState } from 'react';
import axios from 'axios';

const ReminderForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    message: '',
    sendDate: ''
  });

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API_BASE_URL}/api/reminders`, {
        ...formData,
        sendDate: new Date(formData.sendDate)  // Save as JS Date object
      });
      alert('✅ Reminder Scheduled!');
      setFormData({ name: '', phoneNumber: '', message: '', sendDate: '' });
    } catch (err) {
      alert('❌ Error scheduling reminder');
      console.error(err);
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
