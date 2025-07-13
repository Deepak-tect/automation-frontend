import React, { useState } from 'react';
import { signInWithGoogle as firebaseSignInWithGoogle } from '../firebase';
import './Login.css'; 
import googleLogo from '../assets/google.png'; 
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  console.log("Login component loaded");

  const handleLogin = async (e) => {
    e.preventDefault();
    


    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('authToken', data.token); // Save JWT token
        navigate('/dashboard');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed due to server error');
    }
  };


  const handleGoogleLogin = async () => {
  try {
    const result = await firebaseSignInWithGoogle();
    const user = result.user;

    const idToken = await user.getIdToken();

    const response = await fetch('/api/google-auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userEmail', data.email);
      alert(`Signed in as ${data.email}`);
      navigate('/dashboard');
    } else {
      alert(data.message || 'Login failed');
    }
  } catch (error) {
    console.error('Google sign-in failed', error);
    alert('Google login failed');
  }
};


  return (
    <div className="login-container">
      <div className="left-image"></div>

      <div className="right-login">
        <div className="login-box">
          <h2>Welcome to LightBeam Deployment</h2>

          <form onSubmit={handleLogin} className="login-form">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">Login</button>
          </form>

          <div className="divider">
            <span>or</span>
          </div>

          <button className="google-btn" onClick={handleGoogleLogin}>
            <img src={googleLogo} alt="Google logo" />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
