import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddHall = () => {
  const [venues, setVenues] = useState([]);
  const [venueId, setVenueId] = useState('');
  const [hallName, setHallName] = useState('');
  const [hallType, setHallType] = useState('');
  const [status, setStatus] = useState('active');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    axios.get("http://localhost:5000/api/venues/venue_id_and_name", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setVenues(res.data.map(v => ({
            ...v,
            id: parseInt(v.id, 10)
          })));
        }
      })
      .catch((err) => {
        console.error("Error fetching venues:", err);
        setError("Failed to fetch venues. Please check your login or token.");
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!venueId || !hallName || !hallType) {
      alert('Please fill in all fields');
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    const hallData = {
      venue_id: venueId,
      name: hallName,
      type: hallType,
      status: status,
    };

    try {
      const res = await axios.put('http://localhost:5000/api/venues/add-hall', hallData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert(res.data.message || 'Hall added successfully');

      setVenueId('');
      setHallName('');
      setHallType('');
      setStatus('active');
      setError('');
    } catch (err) {
      console.error("Error adding hall:", err);
      alert('Error adding hall: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div style={styles.container}>
      <h2>Add Hall</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="venue">Select Venue:</label>
          <select
            id="venue"
            value={venueId}
            onChange={(e) => setVenueId(e.target.value)}
            style={styles.input}
          >
            <option value="">Select Venue</option>
            {venues.map(venue => (
              <option key={venue.id} value={venue.id}>
                {venue.name}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="hallName">Hall Name:</label>
          <input
            id="hallName"
            type="text"
            value={hallName}
            onChange={(e) => setHallName(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="hallType">Hall Type:</label>
          <select
            id="hallType"
            value={hallType}
            onChange={(e) => setHallType(e.target.value)}
            style={styles.input}
          >
            <option value="">Select Hall Type</option>
            <option value="standard">Standard</option>
            <option value="vip">VIP</option>
            <option value="deluxe">Deluxe</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="status">Status:</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={styles.input}
          >
            <option value="active">Active</option>
            <option value="maintenance">Maintenance</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <button type="submit" style={styles.button}>Add Hall</button>
      </form>

      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '8px',
  },
  input: {
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    width: '100%',
    boxSizing: 'border-box',
  },
  button: {
    padding: '10px 15px',
    fontSize: '16px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  }
};

export default AddHall;
