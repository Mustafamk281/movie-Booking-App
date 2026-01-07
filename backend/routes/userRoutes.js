const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware'); 
const User = require('../models/userModel');  
const Validator = require('validator');
router.post('/register', async (req, res) => {
    const { username, email, password, full_name, phone_number, role } = req.body;

    if (!username || !email || !password || !full_name) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        if(!Validator.isEmail(email)){
            res.status(400).json({ message: "Invalid email format" });
        }
        const existingUser = await User.findByUserName(username);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "Username is already taken" });
        }

        const existingEmail = await User.findByEmail(email);
        if (existingEmail.length > 0) {
            return res.status(400).json({ message: "Email is already registered" });
        }

        
        console.log('Registering Password:', password);

        const hashedPassword = await bcrypt.hash(password, 10);

        console.log('Hashed Password:', hashedPassword);

        await User.createNewUser(username, email, hashedPassword, full_name, phone_number, role === "admin" ? "admin" : "user");

        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        console.error("Error in registration:", error); 
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const user = await User.findByEmail(email);
        if (user.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        console.log('User found by email:', user);  
        console.log('Login Password:', password);  

        console.log('Hashed Password from DB:', user[0].password);

        const isMatch = await bcrypt.compare(password, user[0].password);

        console.log('Password Match:', isMatch);  

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

       
        const token = jwt.sign(
            {
                id: user[0].id,                  
                email: user[0].email,
                role: user[0].role
            },
            process.env.JWT_SECRET,
            { expiresIn: "5h" }
        );

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Error in login:", error);  
        res.status(500).json({ message: "Server error", error: error.message });
    }
});



router.get('/profile', authMiddleware, async (req, res) => {
    const ID = req.user.id;
    console.log("ID from token:", ID); 

    try {
        const user = await User.findByID(ID);
        console.log("User retrieved from DB:", user); 

        if (user.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user: user[0] });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


router.get('/my-bookings', authMiddleware, async (req, res) => {
    const ID = req.user.user_id;
    console.log("ID from token:", ID); 

    try {
        const bookings = await User.getBookingsByUserId(ID);
        console.log("Bookings returned from DB:", bookings);  
        res.status(200).json({ bookings });
    } catch (error) {
        console.error("Error fetching user bookings:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.delete('/delete-account', authMiddleware, async (req, res) => {
    const ID = req.user.id;
    try {
        const user = await User.findByID(ID);
        if (user.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        await User.deleteUser(ID);
        res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        console.error("Error deleting account:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


module.exports = router;
