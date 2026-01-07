import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/movies/get-movie/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const data = await response.json();
        if (response.ok) {
          setMovie(data);
        } else {
          setError(data.message || 'Failed to fetch movie');
        }
      } catch {
        setError('Server error');
      }
    };

    fetchMovie();
  }, [id]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!movie) return <p>Loading...</p>;

  return (
    <div style={{ padding: '20px', backgroundColor: '#001f3d', color: 'white', minHeight: '100vh' }}>
      <h1>{movie.name}</h1>
      <div style={{
  width: '100%',
  maxWidth: '800px',
  margin: '0 auto',
  borderRadius: '12px',
  overflow: 'hidden',
  aspectRatio: '16 / 9',
  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  marginBottom: '20px',
}}>
  <img 
    src={movie.banner_image_url} 
    alt="Banner" 
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      objectPosition: 'top center',
      display: 'block'
    }} 
  />
</div>

      <p><strong>Genre:</strong> {movie.genre_name}</p>
      <p><strong>Trailer:</strong> <a href={movie.trailer_url} target="_blank" rel="noreferrer" style={{ color: '#4fc3f7' }}>Watch Trailer</a></p>
      <p><strong>Duration:</strong> {Math.floor(movie.duration / 60)}h {movie.duration % 60}m</p>
      <p><strong>Rating:</strong> {movie.rating}</p>
      <p><strong>Description:</strong> {movie.description}</p>
      <p><strong>Language:</strong>{movie.language}</p>
      <p><strong>Country of Origin:</strong> {movie.country_of_origin}</p>
    </div>
  );
}

export default MovieDetails;
