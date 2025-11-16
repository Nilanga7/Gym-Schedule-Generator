const express = require('express');
const router = express.Router();
const userService = require('../services/userService');

// Register route
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, age, gender, experienceLevel } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        const user = await userService.registerUser(
            name,
            email,
            password,
            age,
            gender,
            experienceLevel
        );

        res.status(201).json({
            message: 'User registered successfully',
            user
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await userService.loginUser(email, password);

        res.json({
            message: 'Login successful',
            user
        });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

// Get user by ID
router.get('/user/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await userService.getUserById(userId);
        res.json(user);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Update user profile
router.put('/user/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, age, gender, experienceLevel } = req.body;

        const updatedUser = await userService.updateUserProfile(
            userId,
            name,
            age,
            gender,
            experienceLevel
        );

        res.json({
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;