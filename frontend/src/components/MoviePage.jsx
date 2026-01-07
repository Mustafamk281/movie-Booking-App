import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function MoviePage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/movies/get-movies', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const data = await response.json();

        if (response.ok) {
          setMovies(data);
        } else {
          setError(data.message || 'Failed to fetch movies');
        }
      } catch (err) {
        setError('Error connecting to the server.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const containerStyle = {
    backgroundColor: '#001f3d',
    color: '#fff',
    minHeight: '100vh',
    padding: '20px',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
  };

  const cardStyle = {
    backgroundColor: '#003366',
    borderRadius: '10px',
    overflow: 'hidden',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
    transition: 'transform 0.2s ease',
  };

  const cardHoverStyle = {
    transform: 'scale(1.03)',
  };

  const imageStyle = {
    width: '100%',
    height: '250px',
    objectFit: 'cover',
  };

  const nameStyle = {
    padding: '10px',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '18px',
    backgroundColor: '#002244',
  };

  const errorStyle = {
    color: 'red',
    textAlign: 'center',
    marginTop: '20px',
  };

  const handleCardClick = (id) => {
    navigate(`/movie/${id}`);
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>All Movies</h1>

      {loading ? (
        <p>Loading movies...</p>
      ) : error ? (
        <p style={errorStyle}>{error}</p>
      ) : movies.length === 0 ? (
        <p>No movies available.</p>
      ) : (
        <div style={gridStyle}>
          {movies.map((movie) => (
            <div
              key={movie.id}
              style={cardStyle}
              onClick={() => handleCardClick(movie.id)}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <img
                src={movie.banner_image_url}
                alt={movie.name}
                style={imageStyle}
              />
              <div style={nameStyle}>{movie.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MoviePage;
