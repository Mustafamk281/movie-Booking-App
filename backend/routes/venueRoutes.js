const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); 
const User = require('../models/userModel');  
const Venue = require('../models/venueModel');
const Validator = require('validator')
router.get('/all-venues', authMiddleware, async (req, res) => {
    console.log(req.user);
    const userId = req.user.id; 
    try {
        const user = await User.findByID(userId); //
        if(user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const venues = await Venue.getAllVenues(); 
        if (venues.length === 0) {
            return res.status(404).json({ message: 'No venues found' });
        }
        res.status(200).json(venues); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve venues' });
    }
});
router.get('/get-venue/:id', authMiddleware, async (req, res) => {
    const userId = req.user.id; 
    const venueId = req.params.id; 
    try {
        const user = await User.findByID(userId); 
        if(user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const venue = await Venue.getVenueByID(venueId); 
        res.status(200).json(venue); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve venues' });
    }
});

router.put('/add-venue', authMiddleware, async (req, res) => {
    const userId = req.user.id; 
    try {
        const user = await User.findByID(userId); 
        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user[0].role !== 'admin') { 
            return res.status(403).json({ message: 'Access denied' });
        }

        const { name, contact_email, contact_phone, address, city, state, postal_code, country, status } = req.body; 
        
        
        if (!name || !contact_email || !contact_phone || !address || !city || !state || !country || !status) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if(!Validator.isEmail(contact_email)) {
            return res.status(400).json({ message: 'Invalid email address' });
        }
        const venueId = await Venue.addVenue(name, contact_email, contact_phone, address, city, state, postal_code, country, status ); 
        
        res.status(201).json({ message: 'Venue added successfully', venueId }); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add venue' });
    }
});
/*
router.get('/get-venue/:id', authMiddleware, async (req, res) => {
    const venueId = req.params.id;
    const userId = req.user.id; // Get the user ID from the request object
    try {
        const user = await User.findByID(userId); 
        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }   
        const venue = await Venue.getVenueById(venueId); // Call model function
        if (venue.length === 0) {
            return res.status(404).json({ message: 'Venue not found' });
        }
        res.status(200).json(venue[0]); // Return the venue object
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve venue' });
    }
});*/

router.delete('/delete-venue/:id', authMiddleware, async (req, res) => {
    const userId = req.user.id;
    const venueId = req.params.id;

    try {
        const user = await User.findByID(userId);
        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user[0].role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const deleted = await Venue.deleteVenueById(venueId);
        if (deleted.affectedRows === 0) {
            return res.status(404).json({ message: 'Venue not found or already deleted' });
        }

        res.status(200).json({ message: 'Venue deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete venue' });
    }
});

router.get('/get-venues/status/:status', authMiddleware, async (req, res) => {
    const status = req.params.status;
    const userId = req.user.id; 
    try {
        const user = await User.findByID(userId);
        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const venues = await Venue.getVenuesByStatus(status);

        res.status(200).json(venues);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve venues by status' });
    }
});


router.get('/venue_id_and_name', authMiddleware, async (req, res) => {
    const userId = req.user.id; 
    try {
        const user = await User.findByID(userId); //
        if(user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const venues = await Venue.getAllVenuesIDAndNames(); 

        res.status(200).json(venues);
    }catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve venues' });
    }
});
// hall related routes//................

router.get('/all-halls', authMiddleware, async (req, res) => {
    const userId = req.user.id; 
    try {
        const user = await User.findByID(userId); //
        if(user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const halls = await Venue.getAllHalls(); 
        res.status(200).json(halls); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve halls' });
    }
});

router.get('/get-hall/:id', authMiddleware, async (req, res) => {
    const hallId = req.params.id; 
    const userId = req.user.id; 
    try {
        const user = await User.findByID(userId); 
        if(user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
      const hall = await Venue.getHallByID(hallId); 
      if (!hall) {
        return res.status(404).json({ message: 'Hall not found' });
      }
      res.status(200).json(hall); 
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to retrieve hall details' });
    }
  });
  
router.put('/add-hall', authMiddleware, async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findByID(userId);

        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user[0].role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const { venue_id, name, type, status } = req.body;

        if (!venue_id || !name ) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const hallId = await Venue.createHall(venue_id, name, type, status);

        res.status(201).json({ message: 'Hall added successfully', hallId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add hall' });
    }
});

router.delete('/delete-hall/:id', authMiddleware, async (req, res) => {
    const userId = req.user.id; 
    const hallId = req.params.id; 

    try {
        const user = await User.findByID(userId);
        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user[0].role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const deleted = await Venue.deleteHallById(hallId); 

        if (deleted) {
            res.status(200).json({ message: 'Hall deleted successfully' });
        } else {
            res.status(404).json({ message: 'Hall not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete hall' });
    }
});

router.get('/get-halls/venue/:venueId', authMiddleware, async (req, res) => {
    const venueId = req.params.venueId;
    const userId = req.user.id; 
    try {
        const user = await User.findByID(userId); 
        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        if( user[0].role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const venue = await Venue.getVenueByID(venueId); 
        if (venue.length === 0) {
            return res.status(404).json({ message: 'Venue not found' });
        }
        const halls = await Venue.getHallsByVenueId(venueId);

        res.status(200).json(halls);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve halls' });
    }
});

router.get('/hall_id_and_name', authMiddleware, async (req, res) => {
    const userId = req.user.id; 
    try {
        const user = await User.findByID(userId); 
        if(user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const halls = await Venue.getAllHallsIDAndNames(); 
        res.status(200).json(halls); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve halls' });
    }
}); 






module.exports = router;