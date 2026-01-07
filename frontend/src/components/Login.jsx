import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);  
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('token', result.token);
        
        setIsLoggedIn(true);

        navigate('/home');
      } else {
        setMessage(result.message || 'Login failed!');
      }
    } catch (error) {
      setMessage('Error connecting to server.');
    }
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '90vh',
    backgroundColor: '#0A1D2A',  
  };

  const formStyle = {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0px 0px 15px rgba(0,0,0,0.2)',
    width: '100%',
    maxWidth: '400px',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
  };

  const buttonStyle = {
    width: '100%',
    padding: '10px',
    backgroundColor: '#0A1D2A',  
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    marginTop: '10px',
    cursor: 'pointer',
    fontWeight: 'bold',
  };

  const hoverRed = {
    color: 'red',
    cursor: 'pointer',
    textDecoration: 'none',
    marginTop: '15px',
    display: 'inline-block',
  };

  const profileButtonStyle = {
    width: '100%',
    padding: '10px',
    backgroundColor: 'green',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    marginTop: '10px',
    cursor: 'pointer',
    fontWeight: 'bold',
  };

  return (
    <div style={containerStyle}>
      <form style={formStyle} onSubmit={handleSubmit}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#0A1D2A' }}>Login</h2>
        
        {!isLoggedIn ? (
          <>
            <input
              type="email"
              placeholder="Email"
              style={inputStyle}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              style={inputStyle}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" style={buttonStyle}
              onMouseOver={(e) => (e.target.style.color = 'red')}
              onMouseOut={(e) => (e.target.style.color = 'white')}>
              Login
            </button>
            <p style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>{message}</p>
            <a href="/signup" style={hoverRed}>Don't have an account? Sign up</a>
          </>
        ) : (
          <button style={profileButtonStyle} onClick={() => navigate('/profile')}>
            Go to Profile
          </button>
        )}
      </form>
    </div>
  );
}

export default Login;
