// src/components/Signup.tsx
import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import '../App.css';

const Signup: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const validateForm = () => {
    if (username.length < 3) {
      setError('Username must be at least 3 characters long.');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSignup = () => {
    if (!validateForm()) return;
    console.log('Signup:', { username, password });
    localStorage.setItem('user', JSON.stringify({ username, password }));
    login(username);
    window.location.href = '/dashboard';
  };

  return (
    <div className="signup-background">
      <div className="container">
        <h2>Sign Up</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={(e) => { e.preventDefault(); handleSignup(); }}>
          <div>
            <label>Username:</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div>
            <label>Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit">Sign Up</button>
        </form>
        <p>Already a user? <a href="/login">Click here to login</a></p>
      </div>
    </div>
  );
};

export default Signup;
