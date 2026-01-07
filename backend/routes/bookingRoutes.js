const express = require('express');
const router = express.Router();
const db = require('../config/db'); 

const authMiddleware = require('../middleware/authMiddleware'); 
const User = require('../models/userModel');  
const Venue = require('../models/venueModel'); 
const Show = require('../models/showModel'); 
const Movie = require('../models/movieModel'); 
const Booking = require('../models/bookingModel'); 


router.post('/create-booking/:show_id', authMiddleware, async (req, res) => {
    const userID = req.user.id;
    const show_ID = req.params.show_id;
    const seats = req.body.seats; 
    try{
        const user = User.findByID(userID);
        if (user.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        const show = await Show.getShowByID(show_ID);
        if (!show || show.length === 0) {
            return res.status(404).json({ error: 'Show not found' });
        }
        //res.status(200).json({message:'show found', show});
        const seats_available = show[0].available_seats;
        const type_of_hall = show[0].hall_type;
        //res.status(200).json({message:'hall type is: ', type_of_hall});
        //res.status(200).json({message:'available seats are: ', seats_available});
        if (seats.length > seats_available) {
            return res.status(400).json({ error: 'Not enough seats available' });
        }
        if(seats.length === 0) {
            return res.status(400).json({ error: 'No seats selected' });
        }
        const SeatsQuery = `SELECT seat_no FROM bookedseats WHERE show_id = ? AND seat_no IN (?)`;
        const [bookedSeats] = await db.query(SeatsQuery, [show_ID, seats]);

        if (bookedSeats.length > 0) {
            const bookedSeatsNumbers = bookedSeats.map(seat => seat.seat_no);
            return res.status(400).json({ error: `Seats are already booked` });
        }
        let total_price = 0;
        if(type_of_hall === 'standard'){
            total_price = seats.length * 500; 
        }
        else if(type_of_hall === 'vip'){
            total_price = seats.length * 1000; 
        }
        else if(type_of_hall === 'deluxe'){
            total_price = seats.length * 1500; 
        }
        else{
            return res.status(400).json({ error: 'Invalid hall type' });
        }
        //res.status(200).json({message:'Object is ',userID, show_ID, seats, total_price });
        const booking = await Booking.createBooking(userID, show_ID, seats, total_price);
        if (!booking) {
            return res.status(500).json({ error: 'Failed to create booking' });
        }
        return res.status(201).json({ message: 'Booking created successfully', booking_id: booking });

    }catch (error) {
        console.error("Error creating booking:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/booked-seats/:show_id', authMiddleware, async (req, res) => {
    const userID = req.user.id;
    const show_id = req.params.show_id;

    try {
        const user = await User.findByID(userID);
        if (user.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const show = await Show.getShowByID(show_id);
        if (!show || show.length === 0) {
            return res.status(404).json({ error: 'Show not found' });
        }

        const bookedSeats = await Booking.getBookedSeats(show_id);

        return res.status(200).json(bookedSeats);

    } catch (error) {
        console.error("Error fetching booked seats:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
/*
router.get('/user-bookings', authMiddleware, async (req, res) => {
    const userID = req.user.id;
    try {
        // 1. Check if user exists
        const user = await User.findByID(userID);
        if (user.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // 2. Get all bookings for the user
        const bookings = await Booking.getBookingsByUserID(userID);
        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ error: 'No bookings found for this user' });
        }
        res.status(404).json({message:'The bookings are', bookings});


    } catch (error) {
        console.error("Error fetching user bookings:", error);
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});*/
router.get('/user-bookings', authMiddleware, async (req, res) => {
    const userID = req.user.id;
    try {
        const user = await User.findByID(userID);
        if (user.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const bookings = await Booking.getBookingsByUserID(userID);
        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ error: 'No bookings found for this user' });
        }

        const bookingDetails = await Promise.all(bookings.map(async (booking) => {
            const show = await Show.getShowByID(booking.show_id);
            if (!show || show.length === 0) {
                throw new Error(`Show with ID ${booking.show_id} not found`);
            }
        
            const movie = await Movie.getMovieById(show[0].movie_id);
            if (!movie || movie.length === 0) {
                throw new Error(`Movie with ID ${show[0].movie_id} not found`);
            }
        
           
            const seatRows = await db.query("SELECT seat_no FROM BookedSeats WHERE booking_id = ?", [booking.booking_id]);
            const bookedSeats = seatRows[0].map(row => row.seat_no);
        
            return {
                booking_id: booking.booking_id,
                show_id: booking.show_id,
                movie_title: movie[0].title,
                show_time: show[0].start_time,
                booked_seats: bookedSeats,
                total_price: booking.total_price,
                status: booking.payment_status
            };
        }));
        

        return res.status(200).json(bookingDetails);

    } catch (error) {
        console.error("Error fetching user bookings:", error);
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});


router.delete('/cancel-booking/:booking_id', authMiddleware, async (req, res) => {
    const userID = req.user.id;
    const booking_id = req.params.booking_id;

    try {
        const user = await User.findByID(userID);
        if (user.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const booking = await Booking.getBookingsByUserID(userID, booking_id);
        if (!booking || booking.length === 0) {
            return res.status(404).json({ error: 'Booking not found or does not belong to this user' });
        }

        await Booking.cancelBooking(booking_id); 

        return res.status(200).json({ message: 'Booking cancelled successfully' });

    } catch (error) {
        console.error("Error cancelling booking:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/available-seats/:show_id', authMiddleware, async (req, res) => {
    const userId = req.user.id;
    const show_id = req.params.show_id;
    try{
        const user = await User.findByID(userId);
        if (user.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        const show = await Show.getShowByID(show_id);
        if (show.length === 0) {
            return res.status(404).json({ error: 'Show not found' });
        }
        res.status(200).json({
            available_seats: show[0].available_seats,
            booked_seats: 75 - show[0].available_seats 
        });
        
    }catch (error) {
        console.error("Error fetching available seats:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});



router.post('/payment/:booking_id', authMiddleware, async (req, res) => {
    try {
      const userId = req.user.id;
      const bookingID = req.params.booking_id;
  
      console.log(`🔐 User ID: ${userId}, Booking ID: ${bookingID}`);
  
      const user = await User.findByID(userId);
      if (!user || user.length === 0) {
        console.log("User not found");
        return res.status(404).json({ error: 'User not found' });
      }
  
      const booking = await Booking.getBookingByID(bookingID); 
      if (!booking || booking.length === 0) {
        console.log("Booking not found");
        return res.status(404).json({ error: 'Booking not found' });
      }
  
      const paymentStatus = booking.payment_status;
      console.log(`💳 Payment Status: ${paymentStatus}`);
  
      if (paymentStatus === 'Completed') {
        return res.status(200).json({ message: 'Payment is already done' });
      } else if (paymentStatus === 'Pending') {
        const sql = `UPDATE bookings SET payment_status = ? WHERE booking_id = ?`;
  
        const start = Date.now();
        await db.query(sql, ['Completed', bookingID]);
        console.log(`Payment updated in ${Date.now() - start}ms`);
  
        return res.status(200).json({ message: 'Payment completed successfully' });
      } else {
        return res.status(400).json({ error: 'Invalid payment status' });
      }
  
    } catch (err) {
      console.error(" Error in /payment route:", err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  




module.exports = router;