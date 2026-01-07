import React from 'react';

function Home() {
  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
    color: '#fff',
    fontFamily: "'Arial', sans-serif",
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '20px'
  };

  const heroStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '40px 20px',
    background: 'rgba(0,0,0,0.3)',
    borderRadius: '16px',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.1)'
  };

  const titleStyle = {
    fontSize: '3.5rem',
    fontWeight: '800',
    margin: '0 0 20px 0',
    background: 'linear-gradient(90deg, #ff9966, #ff5e62)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '1px'
  };

  const subtitleStyle = {
    fontSize: '1.5rem',
    fontWeight: '300',
    lineHeight: '1.6',
    marginBottom: '40px',
    opacity: '0.9'
  };

  const footerStyle = {
    marginTop: '50px',
    fontSize: '0.9rem',
    opacity: '0.7'
  };

  return (
    <div style={containerStyle}>
      <div style={heroStyle}>
        <h1 style={titleStyle}>CINEMAX</h1>
        <p style={subtitleStyle}>
          Your gateway to the latest movies and showtimes.<br />
          Simple booking. Premium experience.
        </p>
      </div>
      <p style={footerStyle}>
        Coming soon - The ultimate movie booking experience
      </p>
    </div>
  );
}

export default Home;
