import React, { useState } from 'react';
import axios from 'axios';

function AddVenuePage() {
  const [formData, setFormData] = useState({
    name: '',
    contact_email: '',
    contact_phone: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    status: 'active' 
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:5000/api/venues/add-venue', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert('Venue added successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to add venue.');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Add Venue</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        {Object.keys(formData).map(key => (
          key === 'status' ? (
            <div key={key} style={styles.formGroup}>
              <label style={styles.label}>
                {key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}:
              </label>
              <select
                name={key}
                value={formData[key]}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="active">Active</option>
                <option value="maintenance">Maintenance</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          ) : (
            <div key={key} style={styles.formGroup}>
              <label style={styles.label}>
                {key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}:
              </label>
              <input
                type="text"
                name={key}
                value={formData[key]}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          )
        ))}
        <button type="submit" style={styles.button}>Add Venue</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '40px auto',
    padding: '30px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    fontFamily: 'Arial, sans-serif',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)'
  },
  heading: {
    textAlign: 'center',
    marginBottom: '25px',
    color: '#333'
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  formGroup: {
    marginBottom: '15px'
  },
  label: {
    fontWeight: 'bold',
    display: 'block',
    marginBottom: '5px'
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #ccc',
    borderRadius: '5px'
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px'
  }
};

export default AddVenuePage;
