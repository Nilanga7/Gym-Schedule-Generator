const db = require('../config/db');

class ProgressDao {
    // Create progress entry
    async createProgress(userId, date, weight, liftData, notes) {
        const sql = `
            INSERT INTO progress (user_id, date, weight, lift_data, notes)
            VALUES (?, ?, ?, ?, ?)
        `;
        try {
            const liftDataJson = JSON.stringify(liftData);
            const result = await db.runAsync(sql, [userId, date, weight, liftDataJson, notes]);
            return result.id;
        } catch (error) {
            throw new Error(`Error creating progress: ${error.message}`);
        }
    }

    // Get progress by user ID
    async getProgressByUserId(userId) {
        const sql = `
            SELECT * FROM progress 
            WHERE user_id = ? 
            ORDER BY date DESC
        `;
        try {
            const progress = await db.allAsync(sql, [userId]);
            return progress.map(entry => ({
                ...entry,
                lift_data: entry.lift_data ? JSON.parse(entry.lift_data) : null
            }));
        } catch (error) {
            throw new Error(`Error getting progress: ${error.message}`);
        }
    }

    // Get progress by date range
    async getProgressByDateRange(userId, startDate, endDate) {
        const sql = `
            SELECT * FROM progress 
            WHERE user_id = ? AND date BETWEEN ? AND ?
            ORDER BY date ASC
        `;
        try {
            const progress = await db.allAsync(sql, [userId, startDate, endDate]);
            return progress.map(entry => ({
                ...entry,
                lift_data: entry.lift_data ? JSON.parse(entry.lift_data) : null
            }));
        } catch (error) {
            throw new Error(`Error getting progress by date range: ${error.message}`);
        }
    }

    // Get progress by ID
    async getProgressById(progressId) {
        const sql = 'SELECT * FROM progress WHERE progress_id = ?';
        try {
            const entry = await db.getAsync(sql, [progressId]);
            if (entry && entry.lift_data) {
                entry.lift_data = JSON.parse(entry.lift_data);
            }
            return entry;
        } catch (error) {
            throw new Error(`Error getting progress by ID: ${error.message}`);
        }
    }

    // Update progress entry
    async updateProgress(progressId, weight, liftData, notes) {
        const sql = `
            UPDATE progress 
            SET weight = ?, lift_data = ?, notes = ?
            WHERE progress_id = ?
        `;
        try {
            const liftDataJson = JSON.stringify(liftData);
            await db.runAsync(sql, [weight, liftDataJson, notes, progressId]);
            return true;
        } catch (error) {
            throw new Error(`Error updating progress: ${error.message}`);
        }
    }

    // Delete progress entry
    async deleteProgress(progressId) {
        const sql = 'DELETE FROM progress WHERE progress_id = ?';
        try {
            await db.runAsync(sql, [progressId]);
            return true;
        } catch (error) {
            throw new Error(`Error deleting progress: ${error.message}`);
        }
    }

    // Get latest weight for user
    async getLatestWeight(userId) {
        const sql = `
            SELECT weight FROM progress 
            WHERE user_id = ? AND weight IS NOT NULL
            ORDER BY date DESC 
            LIMIT 1
        `;
        try {
            const result = await db.getAsync(sql, [userId]);
            return result ? result.weight : null;
        } catch (error) {
            throw new Error(`Error getting latest weight: ${error.message}`);
        }
    }

    // Get progress count for user
    async getProgressCount(userId) {
        const sql = 'SELECT COUNT(*) as count FROM progress WHERE user_id = ?';
        try {
            const result = await db.getAsync(sql, [userId]);
            return result.count;
        } catch (error) {
            throw new Error(`Error getting progress count: ${error.message}`);
        }
    }
}

module.exports = new ProgressDao();