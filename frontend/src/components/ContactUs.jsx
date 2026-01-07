import React from 'react';

function ContactUs() {
  const containerStyle = {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '30px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#333'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '40px'
  };

  const titleStyle = {
    fontSize: '2.5rem',
    color: '#2c3e50',
    marginBottom: '10px'
  };

  const subtitleStyle = {
    fontSize: '1.1rem',
    color: '#7f8c8d',
    fontWeight: '300'
  };

  const contactGrid = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
    marginTop: '50px'
  };

  const contactMethod = {
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease'
  };

  const iconStyle = {
    fontSize: '2.5rem',
    marginBottom: '20px',
    color: '#3498db'
  };

  const formStyle = {
    marginTop: '50px',
    background: '#f9f9f9',
    padding: '30px',
    borderRadius: '8px'
  };

  const inputStyle = {
    width: '100%',
    padding: '15px',
    margin: '10px 0',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px'
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '150px'
  };

  const buttonStyle = {
    background: '#3498db',
    color: 'white',
    border: 'none',
    padding: '15px 30px',
    fontSize: '16px',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background 0.3s'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Get in Touch</h1>
        <p style={subtitleStyle}>We'd love to hear from you! Reach out through any of these channels.</p>
      </div>

      <div style={contactGrid}>
        <div style={contactMethod}>
          <div style={iconStyle}>📧</div>
          <h2>Email Us</h2>
          <p>support@moviebook.com</p>
          <p>business@moviebook.com</p>
        </div>

        <div style={contactMethod}>
          <div style={iconStyle}>📞</div>
          <h2>Call Us</h2>
          <p>+1 (555) 123-4567</p>
          <p>Mon-Fri: 9am - 6pm PST</p>
        </div>

        <div style={contactMethod}>
          <div style={iconStyle}>📍</div>
          <h2>Visit Us</h2>
          <p>123 Bajwa street Asim Munir Town</p>
          <p>Lahore DHA, MC 1000</p>
        </div>
      </div>

      <div style={formStyle}>
        <h2 style={{marginTop: '0', color: '#2c3e50'}}>Send a Message</h2>
        <form>
          <input 
            style={inputStyle} 
            type="text" 
            placeholder="Your Name" 
            required 
          />
          <input 
            style={inputStyle} 
            type="email" 
            placeholder="Email Address" 
            required 
          />
          <input 
            style={inputStyle} 
            type="text" 
            placeholder="Subject" 
            required 
          />
          <textarea 
            style={textareaStyle} 
            placeholder="Your Message" 
            required
          ></textarea>
          <button 
            style={buttonStyle} 
            type="submit"
            onMouseEnter={e => e.target.style.background = '#2980b9'}
            onMouseLeave={e => e.target.style.background = '#3498db'}
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}

export default ContactUs;
