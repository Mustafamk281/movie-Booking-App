import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function HallList() {
  const [halls, setHalls] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/venues/all-halls', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setHalls(response.data); 
      } catch (err) {
        setError('Failed to fetch halls');
        console.error(err);
      }
    };

    fetchHalls();
  }, []); 

  const handleHallClick = (hallId) => {
    navigate(`/hall/${hallId}`);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1 style={{ textAlign: 'center' }}>All Halls</h1>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {halls.length === 0 ? (
        <p>No halls available</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, textAlign: 'center' }}>
          {halls.map((hall) => (
            <li
              key={hall.id}
              onClick={() => handleHallClick(hall.id)}
              style={{
                margin: '10px 0',
                padding: '10px',
                backgroundColor: '#f5f5f5',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
            >
              {hall.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default HallList;
