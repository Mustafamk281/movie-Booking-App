import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function CreateBooking() {
  const { showId } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Authentication token missing");
      navigate("/login");
      return;
    }

    async function fetchShow() {
      try {
        const res = await fetch(`http://localhost:5000/api/shows/get-show/${showId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 404) {
            alert("Show not found");
            navigate("/shows");
          } else {
            throw new Error("Failed to fetch show");
          }
          return;
        }

        const data = await res.json();
        if (!data.length) {
          alert("Show not found");
          navigate("/shows");
          return;
        }

        console.log("Fetched show:", data[0]);
        setShow(data[0]);
      } catch (err) {
        console.error("Error fetching show:", err);
        alert("Error fetching show details");
      }
    }

    fetchShow();
  }, [showId, navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!show || !token) return;

    async function fetchBookedSeats() {
      try {
        const res = await fetch(`http://localhost:5000/api/bookings/booked-seats/${show.show_id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Failed to fetch seats");

        const data = await res.json();
        console.log("Booked seats:", data);
        setBookedSeats(data);
      } catch (err) {
        console.error("Error fetching booked seats:", err);
        alert("Error fetching booked seats");
      }
    }

    fetchBookedSeats();
  }, [show]);

  function toggleSeat(seatNum) {
    if (bookedSeats.includes(seatNum)) return;
    setSelectedSeats(prev =>
      prev.includes(seatNum)
        ? prev.filter(num => num !== seatNum)
        : [...prev, seatNum]
    );
  }

  async function handleBooking() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Authentication token missing");
      return;
    }

    if (selectedSeats.length === 0) {
      alert("Please select seats to book");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/bookings/create-booking/${show.show_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ seats: selectedSeats }),
      });

      if (!res.ok) throw new Error("Booking failed");

      alert("Booking successful!");
      navigate("/shows");
    } catch (err) {
      console.error("Booking error:", err);
      alert("Failed to book seats");
    }
  }

  if (!show) return <div>Loading...</div>;

  const totalSeats = show.total_seats || 75; 

  return (
    <div>
      <h2>Book seats for {show.movie_title} at {show.hall_name}</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', width: 600 }}>
        {Array.from({ length: totalSeats }, (_, i) => {
          const seatNum = i + 1;
          const isBooked = bookedSeats.includes(seatNum);
          const isSelected = selectedSeats.includes(seatNum);

          return (
            <div
              key={seatNum}
              onClick={() => toggleSeat(seatNum)}
              style={{
                width: 40,
                height: 40,
                margin: 5,
                lineHeight: '40px',
                textAlign: 'center',
                background: isBooked
                  ? 'gray'
                  : isSelected
                    ? 'green'
                    : 'white',
                border: '1px solid #000',
                cursor: isBooked ? 'not-allowed' : 'pointer',
                color: isBooked ? '#fff' : '#000'
              }}
            >
              {seatNum}
            </div>
          );
        })}
      </div>

      <button onClick={handleBooking} style={{ marginTop: 20 }}>
        Book Tickets
      </button>
    </div>
  );
}

export default CreateBooking;