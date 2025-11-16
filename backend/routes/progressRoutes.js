const express = require('express');
const router = express.Router();
const progressService = require('../services/progressService');

// Log progress
router.post('/', async (req, res) => {
    try {
        const { userId, date, weight, liftData, notes } = req.body;

        // Validation
        if (!userId || !date) {
            return res.status(400).json({ error: 'userId and date are required' });
        }

        const progressId = await progressService.logProgress(
            userId,
            date,
            weight,
            liftData || {},
            notes || ''
        );

        res.status(201).json({
            message: 'Progress logged successfully',
            progressId
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get user progress
router.get('/user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const progress = await progressService.getUserProgress(userId);
        res.json(progress);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get progress chart data
router.get('/charts/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const chartData = await progressService.getProgressForCharts(userId);
        res.json(chartData);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get progress statistics
router.get('/stats/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const stats = await progressService.getProgressStats(userId);
        res.json(stats);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update progress
router.put('/:id', async (req, res) => {
    try {
        const progressId = req.params.id;
        const { weight, liftData, notes } = req.body;

        await progressService.updateProgress(progressId, weight, liftData, notes);

        res.json({ message: 'Progress updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete progress
router.delete('/:id', async (req, res) => {
    try {
        const progressId = req.params.id;
        await progressService.deleteProgress(progressId);
        res.json({ message: 'Progress deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;