const express = require('express');
const router = express.Router();
const scheduleService = require('../services/scheduleService');

// Generate workout schedule
router.post('/generate', async (req, res) => {
    try {
        const { userId, age, gender, goal, availableDays, availableTime, experienceLevel } = req.body;

        // Validation
        if (!userId || !goal || !availableDays || !experienceLevel) {
            return res.status(400).json({ 
                error: 'userId, goal, availableDays, and experienceLevel are required' 
            });
        }

        const userData = {
            age,
            gender,
            goal,
            availableDays: parseInt(availableDays),
            availableTime: parseInt(availableTime),
            experienceLevel
        };

        const schedule = await scheduleService.generateSchedule(userId, userData);

        res.status(201).json({
            message: 'Schedule generated successfully',
            schedule
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get user schedules
router.get('/user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const schedules = await scheduleService.getUserSchedules(userId);
        res.json(schedules);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete schedule
router.delete('/:id', async (req, res) => {
    try {
        const scheduleId = req.params.id;
        await scheduleService.deleteSchedule(scheduleId);
        res.json({ message: 'Schedule deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;