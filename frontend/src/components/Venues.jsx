import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Venues() {
  const [venues, setVenues] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/venues/all-venues', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setVenues(response.data);
      } catch (err) {
        setError('Failed to fetch venues.');
        console.error(err);
      }
    };

    fetchVenues();
  }, []);

  const handleVenueClick = (venueId) => {
    navigate(`/venue/${venueId}`);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1 style={{ textAlign: 'center' }}>Venues</h1>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <ul style={{ listStyle: 'none', padding: 0, textAlign: 'center' }}>
        {venues.map((venue) => (
          <li
            key={venue.id}
            onClick={() => handleVenueClick(venue.id)}
            style={{
              margin: '10px 0',
              padding: '10px',
              backgroundColor: '#f5f5f5',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
          >
            {venue.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Venues;
