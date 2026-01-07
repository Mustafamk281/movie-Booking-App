const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); 
const User = require('../models/userModel'); 
const Venue = require('../models/venueModel'); 
const Show = require('../models/showModel');
const Movie = require('../models/movieModel');


router.put('/add-show',authMiddleware, async (req, res) => {
    const { hall_id, movie_id, start_time } = req.body;
    const userId = req.user.id; 
    if (!hall_id || !movie_id || !start_time) {
        return res.status(400).json({ error: 'Invalid input. Make sure hall_id, movie_id, start_time, and numeric duration are provided.' });
    }

    try {
        const user = await User.findByID(userId);
        
        if (!user || user.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        if(user[0].role !== 'admin') {
            return res.status(403).json({ error: 'Permission denied' });
        }
        const hall = await Venue.getHallByID(hall_id);
        if(hall.length === 0) {
            return res.status(404).json({ error: 'Hall not found' });
        }
        if(hall.status != 'active') {
            return res.status(400).json({ error: 'Hall is not active' });
        }
        const movie = await Movie.getMovieById(movie_id);
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        const duration = movie[0].duration; 
        const insertedId = await Show.addNewShow(hall_id, movie_id, start_time, duration);
        res.status(201).json({ message: 'Show added successfully', showId: insertedId });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/all-shows',authMiddleware, async (req, res) => {
    const userId = req.user.id; 
    try {
        const user = await User.findByID(userId);
        if(user.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const shows = await Show.getAllShows(); 
        res.status(200).json(shows); 
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/get-show/:id',authMiddleware, async (req, res) => {
    const userId = req.user.id; 
    const showId = req.params.id; 
    try {
        const user = await User.findByID(userId);
        if(user.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const show = await Show.getShowByID(showId); 
        if(! show || show.length === 0) {
            return res.status(404).json({ error: 'show not found' });
        }
        res.status(200).json(show); 
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/delete-show/:id',authMiddleware, async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params; 

    try {
        const user = await User.findByID(userId);
        if(user.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        if(user[0].role !== 'admin') {
            return res.status(403).json({ error: 'Permission denied' });
        }
        const show = await Show.getShowByID(id);
        if(show.length === 0) {
            return res.status(404).json({ error: 'Show not found!!' });
        }
        const result = await Show.deleteShow(id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Show not found' });
        }

        res.status(200).json({ message: 'Show deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete the show', details: err.message });
    }
});

router.get('/movie/:movieId',authMiddleware, async (req, res) => {
    const userId = req.user.id; 
    const user = await User.findByID(userId);
    if(user.length === 0) {
        return res.status(404).json({ error: 'User not found' });
    }
    const { movieId } = req.params;  

    try {
        
        const shows = await Show.getShowsByMovieId(movieId);

       
        res.status(200).json(shows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve shows', details: err.message });
    }
});

router.get('/venue/:venueId',authMiddleware, async (req, res) => {
    const { venueId } = req.params;  
    const userId = req.user.id; 
    const user = await User.findByID(userId);
    if(user.length === 0) {
        return res.status(404).json({ error: 'User not found' });
    }
    try {
        
        const shows = await Show.getShowsByVenueId(venueId);

       
        res.status(200).json(shows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve shows', details: err.message });
    }
});

router.get('/get-show/hall/:hallId',authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; 
        const user = await User.findByID(userId);
        if(user.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const hallId = req.params.hallId;
        const shows = await Show.getShowsByHallId(hallId);

        res.json(shows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});




module.exports = router;