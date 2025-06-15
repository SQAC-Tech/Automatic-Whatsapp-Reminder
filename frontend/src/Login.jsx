import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/login`, 
        { username, password },
        { withCredentials: true }
      );

      if (res.data.message === 'Login successful') {
        onLoginSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-9 rounded-lg relative top-60 shadow-lg">
      <h2 className="text-4xl font-bold mb-6 text-center">Admin Login</h2>
      <form onSubmit={handleLogin} className="space-y-7">
        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 border rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700">
          Login
        </button>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
