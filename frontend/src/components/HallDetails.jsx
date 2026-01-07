import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const HallDetails = () => {
  const { id } = useParams();
  const [hall, setHall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  console.log("Extracted hall ID from URL:", id); 

  useEffect(() => {
    const fetchHall = async () => {
      try {
        console.log("Sending request to:", `http://localhost:5000/api/venues/get-hall/${id}`); 
        const token = localStorage.getItem('token');
        console.log("Token being sent:", token); 

        const res = await axios.get(`http://localhost:5000/api/venues/get-hall/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log("Response from server:", res.data); 
        setHall(res.data);
        console.log({hall});
        setLoading(false);
      } catch (err) {
        console.error(' Error fetching hall:', err);
        if (err.response) {
          console.error(" Error response from server:", err.response.data);
        } else {
          console.error(" Error message:", err.message);
        }
        setError('Failed to load hall details');
        setLoading(false);
      }
    };

    fetchHall();
  }, [id]);

  if (loading) return <div>Loading hall details...</div>;
  if (error) return <div>{error}</div>;
  if (!hall) return <div>No hall data found.</div>;

  return (
    <div className="hall-details" style={{ padding: '20px', border: '1px solid #ccc' }}>
      <h2>Hall Details</h2>
      <p><strong>ID:</strong> {hall.id}</p>
      <p><strong>Name:</strong> {hall.hall_name}</p>
      <p><strong>Type:</strong> {hall.type}</p>
      <p><strong>Status:</strong> {hall.status}</p>
      <p><strong>Venue Name:</strong> {hall.venue_name}</p>
      <p><strong>Created At:</strong> {new Date(hall.created_at).toLocaleString()}</p>
    </div>
  );
};

export default HallDetails;
