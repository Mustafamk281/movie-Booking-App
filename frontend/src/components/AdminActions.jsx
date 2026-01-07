import React from 'react';
import { Link } from 'react-router-dom';

function AdminActions() {
  return (
    <div style={{ padding: '30px' }}>
      <h2>Admin Actions</h2>
      <Link to="/add-movie">
        <button style={{ ...styles.button, backgroundColor: '#28a745' }}>Add Movie</button>
      </Link>
      <Link to="/delete-movie">
        <button style={{ ...styles.button, backgroundColor: '#dc3545' }}>Delete Movie</button>
      </Link>
      <Link to="/add-venue">
        <button style={{ ...styles.button, backgroundColor: '#dc3545' }}>Add Venue</button>
      </Link>
      <Link to="/delete-venue">
        <button style={{ ...styles.button, backgroundColor: '#dc3545' }}>Delete Venue</button>
      </Link>
      <Link to="/add-hall">
        <button style={{ ...styles.button, backgroundColor: '#dc3545' }}>Add Hall</button>
      </Link>
      <Link to="/delete-hall">
        <button style={{ ...styles.button, backgroundColor: '#dc3545' }}>Delete Hall</button>
      </Link>
      <Link to="/add-show">
        <button style={{ ...styles.button, backgroundColor: '#dc3545' }}>Add Show</button>
      </Link>
    </div>
  );
}

const styles = {
  button: {
    marginTop: '20px',
    marginRight: '20px',
    padding: '10px 25px',
    fontSize: '16px',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  }
};

export default AdminActions;
