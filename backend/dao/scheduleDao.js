const db = require('../config/db');

class ScheduleDao {
    // Create schedule entry
    async createSchedule(userId, goal, availableDays, availableTime, day, exercises) {
        const sql = `
            INSERT INTO schedules (user_id, goal, available_days, available_time, day, exercises)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        try {
            const exercisesJson = JSON.stringify(exercises);
            const result = await db.runAsync(sql, [userId, goal, availableDays, availableTime, day, exercisesJson]);
            return result.id;
        } catch (error) {
            throw new Error(`Error creating schedule: ${error.message}`);
        }
    }

    // Get schedules by user ID
    async getSchedulesByUserId(userId) {
        const sql = `
            SELECT * FROM schedules 
            WHERE user_id = ? 
            ORDER BY created_date DESC
        `;
        try {
            const schedules = await db.allAsync(sql, [userId]);
            return schedules.map(schedule => ({
                ...schedule,
                exercises: JSON.parse(schedule.exercises)
            }));
        } catch (error) {
            throw new Error(`Error getting schedules: ${error.message}`);
        }
    }

    // Get latest schedule by user ID
    async getLatestScheduleByUserId(userId) {
        const sql = `
            SELECT * FROM schedules 
            WHERE user_id = ? 
            ORDER BY created_date DESC 
            LIMIT 7
        `;
        try {
            const schedules = await db.allAsync(sql, [userId]);
            return schedules.map(schedule => ({
                ...schedule,
                exercises: JSON.parse(schedule.exercises)
            }));
        } catch (error) {
            throw new Error(`Error getting latest schedule: ${error.message}`);
        }
    }

    // Get schedule by ID
    async getScheduleById(scheduleId) {
        const sql = 'SELECT * FROM schedules WHERE schedule_id = ?';
        try {
            const schedule = await db.getAsync(sql, [scheduleId]);
            if (schedule) {
                schedule.exercises = JSON.parse(schedule.exercises);
            }
            return schedule;
        } catch (error) {
            throw new Error(`Error getting schedule by ID: ${error.message}`);
        }
    }

    // Delete schedule
    async deleteSchedule(scheduleId) {
        const sql = 'DELETE FROM schedules WHERE schedule_id = ?';
        try {
            await db.runAsync(sql, [scheduleId]);
            return true;
        } catch (error) {
            throw new Error(`Error deleting schedule: ${error.message}`);
        }
    }

    // Delete all schedules for a user
    async deleteUserSchedules(userId) {
        const sql = 'DELETE FROM schedules WHERE user_id = ?';
        try {
            await db.runAsync(sql, [userId]);
            return true;
        } catch (error) {
            throw new Error(`Error deleting user schedules: ${error.message}`);
        }
    }

    // Get schedule count for user
    async getScheduleCount(userId) {
        const sql = 'SELECT COUNT(*) as count FROM schedules WHERE user_id = ?';
        try {
            const result = await db.getAsync(sql, [userId]);
            return result.count;
        } catch (error) {
            throw new Error(`Error getting schedule count: ${error.message}`);
        }
    }
}

module.exports = new ScheduleDao();