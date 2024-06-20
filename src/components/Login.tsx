// src/components/Login.tsx
import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import '../App.css';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
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

  const handleLogin = () => {
    if (!validateForm()) return;
    const user = { username, password };
    console.log('Login:', { username, password, rememberMe });

    const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (savedUser.username === username && savedUser.password === password) {
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      login(username);
      window.location.href = '/dashboard';
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="login-background">
      <div className="container">
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
          <div>
            <label>Username:</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div>
            <label>Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div>
            <label>
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
              Remember Me
            </label>
          </div>
          <button type="submit">Login</button>
        </form>
        <p>New user? <a href="/signup">Click here to sign up</a></p>
      </div>
    </div>
  );
};

export default Login;
