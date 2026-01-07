import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DeleteMovie() {
  const [movies, setMovies] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:5000/api/movies/movies-names', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMovies(res.data);
      } catch (err) {
        alert('Failed to fetch movies');
      }
    };

    fetchMovies();
  }, []);


  const handleDelete = async () => {
    if (!selectedMovieId) {
      alert('Please select a movie');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const res = await axios.delete(`http://localhost:5000/api/movies/delete-movie/${selectedMovieId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.status === 200) {
        alert(res.data.message);  
        setSelectedMovieId('');
        const updatedMovies = movies.filter(movie => movie.id !== parseInt(selectedMovieId));
        setMovies(updatedMovies);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete movie';
      alert(errorMessage);
    }
  };


  return (
    <div style={{ padding: '30px' }}>
      <h2>Delete Movie</h2>
      <select
        value={selectedMovieId}
        onChange={(e) => setSelectedMovieId(e.target.value)}
        style={{ marginRight: '10px', padding: '5px' }}
      >
        <option value="">Select a movie</option>
        {movies.map(movie => (
          <option key={movie.id} value={movie.id}>{movie.name}</option>
        ))}
      </select>
      <button onClick={handleDelete} style={{ padding: '5px 10px' }}>Delete</button>
    </div>
  );
}

export default DeleteMovie;
