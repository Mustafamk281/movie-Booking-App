import React, { useState, useEffect } from 'react';

function AddMovie() {
  const [movieDetails, setMovieDetails] = useState({
    genre_id: '',
    name: '',
    trailer_url: '',
    banner_image_url: '',
    duration: '',
    rating: '',
    description: '',
    language: '',
    country_of_origin: ''
  });

  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/movies/genres');
        const data = await response.json();
        if (response.ok) {
          setGenres(data); 
        } else {
          alert('Failed to fetch genres');
        }
      } catch (error) {
        console.error(error);
        alert('Error fetching genres');
      }
    };

    fetchGenres();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovieDetails({
      ...movieDetails,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/movies/add-movie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(movieDetails)
      });

      const data = await response.json();
      if (response.ok) {
        alert('Movie added successfully');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert('Error adding movie');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Add Movie</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Genre</label>
          <select
            name="genre_id"
            value={movieDetails.genre_id}
            onChange={handleChange}
            style={styles.input}
            required
          >
            <option value="">Select Genre</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Movie Name</label>
          <input
            type="text"
            name="name"
            value={movieDetails.name}
            onChange={handleChange}
            placeholder="Enter movie name"
            required
            style={styles.input}
          />
        </div>
        
        {/* Other form fields for trailer URL, banner image URL, etc. */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Trailer URL</label>
          <input
            type="text"
            name="trailer_url"
            value={movieDetails.trailer_url}
            onChange={handleChange}
            placeholder="Enter trailer URL"
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Banner Image URL</label>
          <input
            type="text"
            name="banner_image_url"
            value={movieDetails.banner_image_url}
            onChange={handleChange}
            placeholder="Enter banner image URL"
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Duration (in minutes)</label>
          <input
            type="number"
            name="duration"
            value={movieDetails.duration}
            onChange={handleChange}
            placeholder="Enter duration"
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Rating</label>
          <input
            type="number"
            name="rating"
            value={movieDetails.rating}
            onChange={handleChange}
            placeholder="Enter rating"
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Description</label>
          <textarea
            name="description"
            value={movieDetails.description}
            onChange={handleChange}
            placeholder="Enter description"
            required
            style={styles.textarea}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Language</label>
          <input
            type="text"
            name="language"
            value={movieDetails.language}
            onChange={handleChange}
            placeholder="Enter language"
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Country of Origin</label>
          <input
            type="text"
            name="country_of_origin"
            value={movieDetails.country_of_origin}
            onChange={handleChange}
            placeholder="Enter country of origin"
            required
            style={styles.input}
          />
        </div>

        <button type="submit" style={styles.button}>Add Movie</button>
      </form>
    </div>
  );
}

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
  textarea: {
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    width: '100%',
    boxSizing: 'border-box',
    height: '100px',
  },
  button: {
    padding: '12px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    fontSize: '16px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default AddMovie;
