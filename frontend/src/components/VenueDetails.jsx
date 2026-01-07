import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; 

function VenueDetail() {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVenueDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/venues/get-venue/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (Array.isArray(response.data) && response.data.length > 0) {
          setVenue(response.data[0]);
        } else {
          setError('Venue not found.');
        }
      } catch (err) {
        setError('Failed to fetch venue details.');
        console.error(err);
      }
    };

    fetchVenueDetails();
  }, [id]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!venue) return <p>Loading venue details...</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>{venue.name}</h1>
      <p><strong>Email:</strong> {venue.contact_email}</p>
      <p><strong>Phone:</strong> {venue.contact_phone}</p>
      <p><strong>Address:</strong> {venue.address}</p>
      <p><strong>City:</strong> {venue.city}</p>
      <p><strong>State:</strong> {venue.state}</p>
      <p><strong>Postal Code:</strong> {venue.postal_code}</p>
      <p><strong>Country:</strong> {venue.country}</p>
      <p><strong>Status:</strong> {venue.status}</p>
      <p><strong>Created At:</strong> {new Date(venue.created_at).toLocaleString()}</p>

      {venue.hall_names && (
        <div>
          <strong>Halls:</strong>
          <ul>
            {venue.hall_names.map((hall, index) => (
              <li key={index}>{hall}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default VenueDetail;
