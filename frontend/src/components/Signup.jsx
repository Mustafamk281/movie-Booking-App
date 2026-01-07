import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [username, setusername] = useState('');
  const [full_name, setfull_name] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone_number, setphone_number] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !full_name || !email || !password || !phone_number) {
      setMessage("All fields are required.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          full_name,
          email,
          password,
          phone_number,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        navigate('/login');
      } else {
        setMessage(result.message || 'Signup failed!');
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

  return (
    <div style={containerStyle}>
      <form style={formStyle} onSubmit={handleSubmit}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#0A1D2A' }}>Sign Up</h2>

        <input
          type="text"
          placeholder="username"
          style={inputStyle}
          value={username}
          onChange={(e) => setusername(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Full Name"
          style={inputStyle}
          value={full_name}
          onChange={(e) => setfull_name(e.target.value)}
          required
        />
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
        <input
          type="text"
          placeholder="Phone Number"
          style={inputStyle}
          value={phone_number}
          onChange={(e) => setphone_number(e.target.value)}
          required
        />

        <button type="submit" style={buttonStyle}
          onMouseOver={(e) => (e.target.style.color = 'red')}
          onMouseOut={(e) => (e.target.style.color = 'white')}>
          Sign Up
        </button>

        {message && <p style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>{message}</p>}
        
        <a href="/login" style={hoverRed}>Already have an account? Log in</a>
      </form>
    </div>
  );
}

export default Signup;
