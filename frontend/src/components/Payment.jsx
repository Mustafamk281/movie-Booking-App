import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';


function Payment() {
    const {bookingId} = useParams(); 
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);
      setMessage('');

      const response = await axios.post(
        `http://localhost:5000/api/bookings/payment/${bookingId}`,
        { payment_status: 'Pending' }, 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, 
          },
        }
      );

      setMessage(response.data.message);
    } catch (err) {
      console.error('Payment error:', err);
      if (err.response && err.response.data?.error) {
        setMessage(err.response.data.error);
      } else {
        setMessage('Something went wrong during payment.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded w-fit m-auto text-center">
      <h2 className="text-xl font-semibold mb-2">Booking ID: {bookingId}</h2>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={handlePayment}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Complete Payment'}
      </button>
      {message && <p className="mt-3 text-gray-800">{message}</p>}
    </div>
  );
}

export default Payment;
