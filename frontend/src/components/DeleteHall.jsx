import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DeleteHall() {
  const [halls, setHalls] = useState([]); 
  const [selectedHallId, setSelectedHallId] = useState(''); 
  const [message, setMessage] = useState(''); 

  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/venues/hall_id_and_name', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, 
          },
        });
        setHalls(response.data); 
      } catch (error) {
        console.error('Error fetching halls:', error);
        setMessage('Failed to load halls');
      }
    };

    fetchHalls();
  }, []);

  const handleDelete = async () => {
    if (!selectedHallId) {
      setMessage('Please select a hall to delete.');
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/venues/delete-hall/${selectedHallId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, 
        },
      });
      setMessage('Hall deleted successfully!');
      setSelectedHallId(''); 
      setHalls(halls.filter((hall) => hall.id !== selectedHallId)); 
    } catch (error) {
      console.error('Error deleting hall:', error);
      setMessage('Failed to delete hall');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Delete Hall</h2>
      {message && <p style={{ color: 'red' }}>{message}</p>}

      <div style={styles.formGroup}>
        <label style={styles.label}>Select Hall:</label>
        <select
          value={selectedHallId}
          onChange={(e) => setSelectedHallId(e.target.value)}
          style={styles.input}
        >
          <option value="">-- Select a Hall --</option>
          {halls.map((hall) => (
            <option key={hall.id} value={hall.id}>
              {hall.name}
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleDelete} style={styles.button}>Delete Hall</button>
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

export default DeleteHall;
