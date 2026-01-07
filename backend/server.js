// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config(); //need to load .env variables

const userRoutes = require('./routes/userRoutes');
const movieRoutes = require('./routes/movieRoutes');
const venueRoutes = require('./routes/venueRoutes'); 
const showRoutes = require('./routes/showRoutes'); 
const bookingRoutes = require('./routes/bookingRoutes');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/venues', venueRoutes); 
app.use('/api/shows', showRoutes); 
app.use('/api/bookings', bookingRoutes); 
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
