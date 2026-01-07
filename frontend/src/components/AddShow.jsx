import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddShow = () => {
  const [movies, setMovies] = useState([]);
  const [halls, setHalls] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [selectedMovieId, setSelectedMovieId] = useState('');
  const [selectedHallId, setSelectedHallId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    axios.get('http://localhost:5000/api/movies/movies-names', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (Array.isArray(res.data)) {
          setMovies(res.data.map(movie => ({
            ...movie,
            id: parseInt(movie.id, 10)
          })));
        }
      })
      .catch(err => {
        console.error("Error fetching movies:", err);
        setError("Failed to fetch movies.");
      });

    axios.get('http://localhost:5000/api/venues/hall_id_and_name', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (Array.isArray(res.data)) {
          setHalls(res.data.map(hall => ({
            ...hall,
            id: parseInt(hall.id, 10)
          })));
        }
      })
      .catch(err => {
        console.error("Error fetching halls:", err);
        setError("Failed to fetch halls.");
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedMovieId || !selectedHallId || !startTime) {
      alert('Please fill in all fields');
      return;
    }

    const token = localStorage.getItem('token');
    const showData = {
      hall_id: selectedHallId,
      movie_id: selectedMovieId,
      start_time: startTime
    };

    try {
      const res = await axios.put('http://localhost:5000/api/shows/add-show', showData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      alert('Show added successfully!');
      setSelectedMovieId('');
      setSelectedHallId('');
      setStartTime('');
      setError('');
    } catch (err) {
      console.error("Error adding show:", err);
      alert('Error adding show: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div style={styles.container}>
      <h2>Add Show</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="movie" style={styles.label}>Select Movie:</label>
          <select
            id="movie"
            value={selectedMovieId}
            onChange={(e) => setSelectedMovieId(parseInt(e.target.value, 10))}
            style={styles.input}
          >
            <option value="">Select Movie</option>
            {movies.map(movie => (
              <option key={movie.id} value={movie.id}>
                {movie.name}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="hall" style={styles.label}>Select Hall:</label>
          <select
            id="hall"
            value={selectedHallId}
            onChange={(e) => setSelectedHallId(parseInt(e.target.value, 10))}
            style={styles.input}
          >
            <option value="">Select Hall</option>
            {halls.map(hall => (
              <option key={hall.id} value={hall.id}>
                {hall.name}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="start-time" style={styles.label}>Start Time:</label>
          <input
            type="datetime-local"
            id="start-time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            style={styles.input}
          />
        </div>

        <button type="submit" style={styles.button}>Add Show</button>
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

export default AddShow;
