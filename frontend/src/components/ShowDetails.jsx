import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';  
import axios from 'axios';

function ShowDetails() {
  const { id } = useParams();  
  const [showDetails, setShowDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/shows/get-show/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setShowDetails(response.data[0]); 

      } catch (err) {
        setError('Failed to fetch show details');
        console.error('Error fetching show details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchShowDetails();
  }, [id]);  

  if (loading) {
    return <div>Loading show details...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  if (!showDetails) {
    return <div>No show details found</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Show Details</h2>
      <div style={styles.details}>
        <p><strong>Show ID:</strong> {showDetails.show_id}</p>
        <p><strong>Movie Name:</strong> {showDetails.movie_title}</p>
        <p><strong>Hall Name:</strong> {showDetails.hall_name}</p>
        <p><strong>Start Time:</strong> {new Date(showDetails.start_time).toLocaleString()}</p>
        <p><strong>End Time:</strong> {new Date(showDetails.end_time).toLocaleString()}</p>
        <p><strong>Available Seats:</strong> {showDetails.available_seats}</p>
      </div>

      <div style={styles.buttonContainer}>
        <Link to={`/create-booking/${showDetails.show_id}`}>
          <button style={styles.bookButton}>Book Seats</button>
        </Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
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
  details: {
    marginTop: '20px',
  },
  buttonContainer: {
    textAlign: 'center',
    marginTop: '20px',
  },
  bookButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default ShowDetails;
