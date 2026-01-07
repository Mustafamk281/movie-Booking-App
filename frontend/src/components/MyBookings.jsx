import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/bookings/user-bookings', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const result = await response.json();
        if (response.ok && Array.isArray(result)) {
          setBookings(result);
        } else {
          setError(result.message || 'Failed to fetch bookings');
        }
      } catch (err) {
        setError('Error connecting to the server.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handlePaymentClick = (bookingId) => {
    navigate(`/payment/${bookingId}`);
  };

  const containerStyle = {
    backgroundColor: '#001f3d',
    color: 'white',
    padding: '20px',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const headerStyle = {
    fontSize: '24px',
    marginBottom: '20px',
  };

  const bookingListStyle = {
    listStyleType: 'none',
    padding: '0',
    width: '100%',
    maxWidth: '600px',
  };

  const bookingItemStyle = {
    backgroundColor: '#003366',
    marginBottom: '10px',
    padding: '10px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
  };

  const buttonStyle = {
    marginTop: '10px',
    backgroundColor: '#00bfff',
    color: '#001f3d',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  };

  const errorStyle = { color: 'red', marginTop: '10px' };
  const loadingStyle = { color: '#ffffff' };

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>My Bookings</h2>
      {loading ? (
        <div style={loadingStyle}>Loading your bookings...</div>
      ) : error ? (
        <div style={errorStyle}>{error}</div>
      ) : (
        <ul style={bookingListStyle}>
          {bookings.length === 0 ? (
            <p style={{ color: '#ffffff' }}>You don't have any bookings yet.</p>
          ) : (
            bookings.map((booking, index) => (
              <li key={index} style={bookingItemStyle}>
                <strong>Show ID:</strong> {booking.show_id} <br />
                <strong>Booking ID:</strong> {booking.booking_id} <br />
                <strong>Show Time:</strong> {new Date(booking.show_time).toLocaleString()} <br />
                <strong>Booked Seats:</strong> {booking.booked_seats.join(', ')} <br />
                <strong>Total Price:</strong> {booking.total_price} <br />
                <strong>Payment Status:</strong> {booking.status} <br />

                {booking.status === 'Pending' && (
                  <button
                    style={buttonStyle}
                    onClick={() => handlePaymentClick(booking.booking_id)}
                  >
                    Proceed to Payment
                  </button>
                )}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

export default MyBookings;




/*
import React, { useState, useEffect } from 'react';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log("Token:", token);  // Ensure token is correct

        const response = await fetch('http://localhost:5000/api/bookings/user-bookings', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,  // Send token in Authorization header
          },
        });

        const result = await response.json();
        console.log("Full response from backend:", result);  // Log the response

        if (response.ok) {
          // Directly use the array of bookings
          if (Array.isArray(result)) {
            setBookings(result);  // Use the array if it's directly returned
          } else {
            setError('Bookings data is not available.');
          }
        } else {
          setError(result.message || 'Failed to fetch bookings');
        }
      } catch (err) {
        setError('Error connecting to the server.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const containerStyle = {
    backgroundColor: '#001f3d', // Dark blue background color
    color: 'white',
    padding: '20px',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const headerStyle = {
    color: '#ffffff', // White text color for the header
    fontSize: '24px',
    marginBottom: '20px',
  };

  const bookingListStyle = {
    listStyleType: 'none',
    padding: '0',
    color: '#d1e0e0', // Light gray text for the list
    width: '100%',
    maxWidth: '600px',
  };

  const bookingItemStyle = {
    backgroundColor: '#003366', // Slightly lighter dark blue for each item
    marginBottom: '10px',
    padding: '10px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
  };

  const errorStyle = {
    color: 'red',
    marginTop: '10px',
  };

  const loadingStyle = {
    color: '#ffffff',
  };

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>My Bookings</h2>
      {loading ? (
        <div style={loadingStyle}>Loading your bookings...</div>
      ) : error ? (
        <div style={errorStyle}>{error}</div>
      ) : (
        <ul style={bookingListStyle}>
          {bookings.length === 0 ? (
            <p style={{ color: '#ffffff' }}>You don't have any bookings yet.</p>
          ) : (
            bookings.map((booking, index) => (
              <li key={index} style={bookingItemStyle}>
                <strong>Show ID: {booking.show_id}</strong> <br />
                <strong>Booking ID:{booking.booking_id }</strong> <br />
                <strong>Show Time:</strong> {new Date(booking.show_time).toLocaleString()} <br />
                <strong>Booked Seats:</strong> {booking.booked_seats.join(', ')} <br />
                <strong>Total Price:</strong> ${booking.total_price} <br />
                <strong>Payment Status:</strong> {booking.status} <br />
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

export default MyBookings;
*/