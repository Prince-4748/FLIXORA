import React, { useState } from 'react';
import '../App.css'; 

const Auth = ({ setIsLoggedIn }) => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = (e) => {
    e.preventDefault();
    if (email && password) {
      setIsLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true');
    } else {
      alert("Please enter details");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 style={{ marginBottom: '25px', color: 'white' }}>
          {isSignIn ? 'Sign In' : 'Sign Up'}
        </h1>
        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {!isSignIn && <input type="text" placeholder="Full Name" className="login-input" required />}
          <input 
            type="email" 
            placeholder="Email" 
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          <button type="submit" className="login-button">
            {isSignIn ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
        <div style={{ marginTop: '20px' }}>
          <span style={{ color: '#737373' }}>
            {isSignIn ? 'New to Flixora?' : 'Already have an account?'}
          </span>
          <span 
            onClick={() => setIsSignIn(!isSignIn)} 
            style={{ color: '#fff', cursor: 'pointer', marginLeft: '5px' }}
          >
            {isSignIn ? 'Sign up now.' : 'Sign in now.'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Auth;