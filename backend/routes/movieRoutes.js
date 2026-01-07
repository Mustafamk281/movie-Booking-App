const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware'); 
const Movie = require('../models/movieModel');  
const User = require('../models/userModel'); 


router.get('/get-movies', authMiddleware, async (req, res) => {
    const ID = req.user.id; 
    try {
        const user = await User.findByID(ID);
        if(user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const movies = await Movie.getMovies(ID); 
        res.status(200).json(movies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


router.get('/get-movie/:id', authMiddleware, async (req, res) => {
    const ID = req.user.id; 
    const movieId = req.params.id; 
    try {
        const user = await User.findByID(ID);
        if(user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const movie = await Movie.getMovieById(movieId);
        if (movie.length === 0) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        const movieObject = {
            id: movie[0].id,
            genre_name:"",
            name: movie[0].name,
            trailer_url: movie[0].trailer_url,
            banner_image_url: movie[0].banner_image_url,
            duration: movie[0].duration,
            rating: movie[0].rating,
            description: movie[0].description,
            language: movie[0].language,
            country_of_origin: movie[0].country_of_origin
        }
        const movie_genre = await Movie.getMovieGenre(movie[0].genre_id);
        movieObject.genre_name = movie_genre;
        res.status(200).json(movieObject);
    }catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});



/*
router.get('/get-movie/:id', authMiddleware, async (req, res) => {
    const ID = req.user.id;
    const movieId = req.params.id; 
    try {
        const user = await User.findByID(ID);
        if(user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const movie = await Movie.getMovieById(movieId);

        res.status(200).json(movie);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});*/


router.post('/add-movie', authMiddleware, async (req, res) => {
    const ID = req.user.id;
    try {
        const user = await User.findByID(ID);
        if(user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const {
            genre_id, name, trailer_url, banner_image_url,
            duration, rating, description, language, country_of_origin
        } = req.body;
        if(!genre_id || !name || !trailer_url || !banner_image_url ||
            !duration || !rating || !description || !language || !country_of_origin) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const movieId = await Movie.addMovie(
            genre_id, name, trailer_url, banner_image_url,
            duration, rating, description, language, country_of_origin
        );

        res.status(201).json({ message: 'Movie added successfully', movieId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add movie' });
    }
});
// eg
router.get('/genres', async (req, res) => {
    try {
      const genres = await Movie.getAllGenres(); 
      res.status(200).json(genres);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch genres' });
    }
  });
  


  router.delete('/delete-movie/:id', authMiddleware, async (req, res) => {
    const ID = req.user.id; 
    try {
        const user = await User.findByID(ID);
        if(user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        if(user[0].role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const movieId = req.params.id; 
        const deletedMovie = await Movie.deleteMovie(movieId); 
        
        if (deletedMovie.success) {
            return res.status(200).json({ message: 'Movie deleted successfully' });
        } else {
            return res.status(404).json({ message: 'Movie not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete movie' });
    }
});


router.get('/movies-names', authMiddleware, async (req, res) => {
    try {
        const movies = await Movie.getAllMoviesNamesAndIDs(); 
        res.status(200).json(movies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch movies' });
    }
});


router.get('/movie-genre/:genre_id',authMiddleware, async (req, res) => {
    const ID = req.user.id; 
    try {
        const user = await User.findByID(ID);
        if(user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const { genre_id } = req.params;
        const movies = await Movie.getMoviesByGenre(genre_id); 
        res.status(200).json(movies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch movies by genre' });
    }
});



module.exports = router;