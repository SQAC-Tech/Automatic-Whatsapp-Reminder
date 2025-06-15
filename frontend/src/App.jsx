import React, { useState } from 'react';
import ReminderForm from './ReminderForm';
import Login from './Login'; // 👈 Make sure this file exists

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-4">
      {isLoggedIn ? (
        <ReminderForm />
      ) : (
        <Login onLoginSuccess={() => setIsLoggedIn(true)} />
      )}
    </div>
  );
}

export default App;
