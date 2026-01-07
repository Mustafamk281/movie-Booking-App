import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  
import axios from 'axios';

function Shows() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();  

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/shows/all-shows', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setShows(response.data);
      } catch (err) {
        setError('Failed to fetch shows');
        console.error('Error fetching shows:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, []);

  if (loading) {
    return <div>Loading shows...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  const handleShowClick = (showId) => {
    navigate(`/show/${showId}`);  
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>All Shows</h2>
      {shows.length === 0 ? (
        <p>No shows available</p>
      ) : (
        <div style={styles.showList}>
          {shows.map((show) => (
            <div
              key={show.show_id}
              style={styles.showCard}
              onClick={() => handleShowClick(show.show_id)} 
            >
              <h3>{show.movie_name}</h3>
              <p>Hall: {show.hall_name}</p>
              <p>Show ID: {show.show_id}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#f4f4f4',
    borderRadius: '8px',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    textAlign: 'center',
    color: '#333',
  },
  showList: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  showCard: {
    padding: '20px',
    margin: '10px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    width: '30%',
    textAlign: 'center',
  },
};

export default Shows;
