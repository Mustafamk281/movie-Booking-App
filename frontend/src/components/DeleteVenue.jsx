import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DeleteVenue() {
  const [venues, setVenues] = useState([]); 
  const [selectedVenueId, setSelectedVenueId] = useState(''); 
  const [message, setMessage] = useState(''); 

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/venues/venue_id_and_name', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, 
          },
        });
        setVenues(response.data); 
      } catch (error) {
        console.error('Error fetching venues:', error);
        setMessage('Failed to load venues');
      }
    };

    fetchVenues();
  }, []);

  const handleDelete = async () => {
    if (!selectedVenueId) {
      setMessage('Please select a venue to delete.');
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/venues/delete-venue/${selectedVenueId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, 
        },
      });
      setMessage('Venue deleted successfully!');
      setSelectedVenueId(''); 
      setVenues(venues.filter((venue) => venue.id !== selectedVenueId)); 
    } catch (error) {
      console.error('Error deleting venue:', error);
      setMessage('Failed to delete venue');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Delete Venue</h2>
      {message && <p style={{ color: 'red' }}>{message}</p>}

      <div style={styles.formGroup}>
        <label style={styles.label}>Select Venue:</label>
        <select
          value={selectedVenueId}
          onChange={(e) => setSelectedVenueId(e.target.value)}
          style={styles.input}
        >
          <option value="">-- Select a Venue --</option>
          {venues.map((venue) => (
            <option key={venue.id} value={venue.id}>
              {venue.name}
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleDelete} style={styles.button}>Delete Venue</button>
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
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '25px',
    color: '#333',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    fontWeight: 'bold',
    display: 'block',
    marginBottom: '5px',
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#f44336', 
    color: '#fff',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
  },
};

export default DeleteVenue;
