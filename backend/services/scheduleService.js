const scheduleDao = require('../dao/scheduleDao');

class ScheduleService {
    // Generate workout schedule based on user parameters
    async generateSchedule(userId, userData) {
        const { age, gender, goal, availableDays, availableTime, experienceLevel } = userData;

        try {
            // Delete existing schedules for this user
            await scheduleDao.deleteUserSchedules(userId);

            // Generate workout plan based on goal
            let weeklyPlan = [];

            switch (goal.toLowerCase()) {
                case 'muscle gain':
                    weeklyPlan = this.generateMuscleGainPlan(availableDays, availableTime, experienceLevel);
                    break;
                case 'fat loss':
                    weeklyPlan = this.generateFatLossPlan(availableDays, availableTime, experienceLevel);
                    break;
                case 'strength':
                    weeklyPlan = this.generateStrengthPlan(availableDays, availableTime, experienceLevel);
                    break;
                case 'endurance':
                    weeklyPlan = this.generateEndurancePlan(availableDays, availableTime, experienceLevel);
                    break;
                default:
                    throw new Error('Invalid fitness goal');
            }

            // Save schedule to database
            const scheduleIds = [];
            for (const dayPlan of weeklyPlan) {
                const scheduleId = await scheduleDao.createSchedule(
                    userId,
                    goal,
                    availableDays,
                    availableTime,
                    dayPlan.day,
                    dayPlan.exercises
                );
                scheduleIds.push(scheduleId);
            }

            return weeklyPlan;
        } catch (error) {
            throw new Error(`Error generating schedule: ${error.message}`);
        }
    }

    // Muscle Gain: Push/Pull/Legs split
    generateMuscleGainPlan(days, time, level) {
        const plan = [];
        const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        
        const exercises = {
            beginner: {
                push: [
                    { name: 'Bench Press', sets: 3, reps: '10-12', rest: '90s' },
                    { name: 'Overhead Press', sets: 3, reps: '10-12', rest: '90s' },
                    { name: 'Dumbbell Flyes', sets: 3, reps: '12-15', rest: '60s' },
                    { name: 'Tricep Dips', sets: 3, reps: '10-12', rest: '60s' }
                ],
                pull: [
                    { name: 'Pull-ups/Lat Pulldown', sets: 3, reps: '10-12', rest: '90s' },
                    { name: 'Barbell Row', sets: 3, reps: '10-12', rest: '90s' },
                    { name: 'Face Pulls', sets: 3, reps: '12-15', rest: '60s' },
                    { name: 'Bicep Curls', sets: 3, reps: '12-15', rest: '60s' }
                ],
                legs: [
                    { name: 'Squats', sets: 3, reps: '10-12', rest: '120s' },
                    { name: 'Leg Press', sets: 3, reps: '12-15', rest: '90s' },
                    { name: 'Leg Curls', sets: 3, reps: '12-15', rest: '60s' },
                    { name: 'Calf Raises', sets: 3, reps: '15-20', rest: '60s' }
                ]
            },
            intermediate: {
                push: [
                    { name: 'Bench Press', sets: 4, reps: '8-10', rest: '120s' },
                    { name: 'Incline Dumbbell Press', sets: 4, reps: '8-10', rest: '90s' },
                    { name: 'Overhead Press', sets: 3, reps: '8-10', rest: '90s' },
                    { name: 'Cable Flyes', sets: 3, reps: '12-15', rest: '60s' },
                    { name: 'Tricep Pushdowns', sets: 3, reps: '12-15', rest: '60s' }
                ],
                pull: [
                    { name: 'Deadlift', sets: 4, reps: '6-8', rest: '180s' },
                    { name: 'Pull-ups', sets: 4, reps: '8-10', rest: '90s' },
                    { name: 'Barbell Row', sets: 4, reps: '8-10', rest: '90s' },
                    { name: 'Face Pulls', sets: 3, reps: '12-15', rest: '60s' },
                    { name: 'Hammer Curls', sets: 3, reps: '12-15', rest: '60s' }
                ],
                legs: [
                    { name: 'Squats', sets: 4, reps: '8-10', rest: '150s' },
                    { name: 'Romanian Deadlift', sets: 4, reps: '8-10', rest: '120s' },
                    { name: 'Leg Press', sets: 3, reps: '12-15', rest: '90s' },
                    { name: 'Leg Curls', sets: 3, reps: '12-15', rest: '60s' },
                    { name: 'Calf Raises', sets: 4, reps: '15-20', rest: '60s' }
                ]
            },
            advanced: {
                push: [
                    { name: 'Bench Press', sets: 5, reps: '5-8', rest: '180s' },
                    { name: 'Incline Bench Press', sets: 4, reps: '8-10', rest: '120s' },
                    { name: 'Overhead Press', sets: 4, reps: '6-8', rest: '120s' },
                    { name: 'Dumbbell Flyes', sets: 4, reps: '10-12', rest: '60s' },
                    { name: 'Tricep Dips (Weighted)', sets: 4, reps: '8-10', rest: '90s' },
                    { name: 'Lateral Raises', sets: 3, reps: '12-15', rest: '60s' }
                ],
                pull: [
                    { name: 'Deadlift', sets: 5, reps: '5-8', rest: '240s' },
                    { name: 'Weighted Pull-ups', sets: 4, reps: '6-8', rest: '120s' },
                    { name: 'Barbell Row', sets: 4, reps: '8-10', rest: '90s' },
                    { name: 'T-Bar Row', sets: 4, reps: '10-12', rest: '90s' },
                    { name: 'Face Pulls', sets: 4, reps: '15-20', rest: '60s' },
                    { name: 'Barbell Curls', sets: 4, reps: '8-10', rest: '60s' }
                ],
                legs: [
                    { name: 'Squats', sets: 5, reps: '5-8', rest: '180s' },
                    { name: 'Front Squats', sets: 4, reps: '8-10', rest: '120s' },
                    { name: 'Romanian Deadlift', sets: 4, reps: '8-10', rest: '120s' },
                    { name: 'Bulgarian Split Squats', sets: 4, reps: '10-12', rest: '90s' },
                    { name: 'Leg Curls', sets: 4, reps: '12-15', rest: '60s' },
                    { name: 'Calf Raises', sets: 5, reps: '15-20', rest: '60s' }
                ]
            }
        };

        const levelExercises = exercises[level.toLowerCase()] || exercises.beginner;
        
        if (days >= 6) {
            plan.push({ day: daysOfWeek[0], exercises: levelExercises.push, notes: 'Push Day - Chest, Shoulders, Triceps' });
            plan.push({ day: daysOfWeek[1], exercises: levelExercises.pull, notes: 'Pull Day - Back, Biceps' });
            plan.push({ day: daysOfWeek[2], exercises: levelExercises.legs, notes: 'Leg Day' });
            plan.push({ day: daysOfWeek[3], exercises: levelExercises.push, notes: 'Push Day - Chest, Shoulders, Triceps' });
            plan.push({ day: daysOfWeek[4], exercises: levelExercises.pull, notes: 'Pull Day - Back, Biceps' });
            plan.push({ day: daysOfWeek[5], exercises: levelExercises.legs, notes: 'Leg Day' });
        } else if (days >= 3) {
            plan.push({ day: daysOfWeek[0], exercises: levelExercises.push, notes: 'Push Day - Chest, Shoulders, Triceps' });
            plan.push({ day: daysOfWeek[2], exercises: levelExercises.pull, notes: 'Pull Day - Back, Biceps' });
            plan.push({ day: daysOfWeek[4], exercises: levelExercises.legs, notes: 'Leg Day' });
        } else {
            const fullBody = [...levelExercises.push.slice(0, 2), ...levelExercises.pull.slice(0, 2), ...levelExercises.legs.slice(0, 2)];
            plan.push({ day: daysOfWeek[0], exercises: fullBody, notes: 'Full Body Workout' });
            if (days === 2) {
                plan.push({ day: daysOfWeek[3], exercises: fullBody, notes: 'Full Body Workout' });
            }
        }

        return plan;
    }

    // Fat Loss: HIIT and Circuit Training
    generateFatLossPlan(days, time, level) {
        const plan = [];
        const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        
        const circuits = {
            beginner: [
                { name: 'Jumping Jacks', sets: 3, reps: '30s', rest: '30s' },
                { name: 'Bodyweight Squats', sets: 3, reps: '15', rest: '30s' },
                { name: 'Push-ups', sets: 3, reps: '10', rest: '30s' },
                { name: 'Mountain Climbers', sets: 3, reps: '20s', rest: '30s' },
                { name: 'Plank', sets: 3, reps: '30s', rest: '60s' }
            ],
            intermediate: [
                { name: 'Burpees', sets: 4, reps: '15', rest: '30s' },
                { name: 'Jump Squats', sets: 4, reps: '15', rest: '30s' },
                { name: 'Push-ups', sets: 4, reps: '20', rest: '30s' },
                { name: 'Mountain Climbers', sets: 4, reps: '40s', rest: '30s' },
                { name: 'Russian Twists', sets: 4, reps: '30', rest: '30s' },
                { name: 'High Knees', sets: 4, reps: '30s', rest: '60s' }
            ],
            advanced: [
                { name: 'Burpee Box Jumps', sets: 5, reps: '12', rest: '20s' },
                { name: 'Kettlebell Swings', sets: 5, reps: '20', rest: '20s' },
                { name: 'Plyometric Push-ups', sets: 5, reps: '15', rest: '20s' },
                { name: 'Sprints', sets: 5, reps: '30s', rest: '30s' },
                { name: 'Battle Ropes', sets: 5, reps: '40s', rest: '20s' },
                { name: 'Box Jumps', sets: 5, reps: '15', rest: '60s' }
            ]
        };

        const circuit = circuits[level.toLowerCase()] || circuits.beginner;

        for (let i = 0; i < days; i++) {
            plan.push({
                day: daysOfWeek[i],
                exercises: circuit,
                notes: 'HIIT Circuit - Complete all exercises, repeat circuit 3-4 times'
            });
        }

        return plan;
    }

    // Strength: Heavy Compound Lifts
    generateStrengthPlan(days, time, level) {
        const plan = [];
        const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        
        const workouts = {
            beginner: {
                day1: [
                    { name: 'Squat', sets: 5, reps: '5', rest: '180s' },
                    { name: 'Bench Press', sets: 5, reps: '5', rest: '180s' },
                    { name: 'Barbell Row', sets: 3, reps: '8', rest: '120s' }
                ],
                day2: [
                    { name: 'Deadlift', sets: 3, reps: '5', rest: '240s' },
                    { name: 'Overhead Press', sets: 5, reps: '5', rest: '180s' },
                    { name: 'Pull-ups', sets: 3, reps: '8', rest: '120s' }
                ]
            },
            intermediate: {
                day1: [
                    { name: 'Squat', sets: 5, reps: '5', rest: '240s' },
                    { name: 'Bench Press', sets: 5, reps: '5', rest: '180s' },
                    { name: 'Barbell Row', sets: 4, reps: '6', rest: '120s' },
                    { name: 'Dips', sets: 3, reps: '8', rest: '90s' }
                ],
                day2: [
                    { name: 'Deadlift', sets: 5, reps: '3', rest: '300s' },
                    { name: 'Overhead Press', sets: 5, reps: '5', rest: '180s' },
                    { name: 'Weighted Pull-ups', sets: 4, reps: '6', rest: '120s' },
                    { name: 'Face Pulls', sets: 3, reps: '15', rest: '60s' }
                ],
                day3: [
                    { name: 'Front Squat', sets: 4, reps: '6', rest: '180s' },
                    { name: 'Incline Bench Press', sets: 4, reps: '6', rest: '180s' },
                    { name: 'Romanian Deadlift', sets: 4, reps: '8', rest: '120s' }
                ]
            },
            advanced: {
                day1: [
                    { name: 'Squat', sets: 6, reps: '3-5', rest: '300s' },
                    { name: 'Bench Press', sets: 6, reps: '3-5', rest: '240s' },
                    { name: 'Barbell Row', sets: 5, reps: '5', rest: '180s' },
                    { name: 'Close Grip Bench', sets: 4, reps: '6', rest: '120s' }
                ],
                day2: [
                    { name: 'Deadlift', sets: 6, reps: '2-4', rest: '360s' },
                    { name: 'Overhead Press', sets: 5, reps: '5', rest: '240s' },
                    { name: 'Weighted Pull-ups', sets: 5, reps: '5', rest: '180s' },
                    { name: 'Barbell Curls', sets: 4, reps: '6', rest: '90s' }
                ],
                day3: [
                    { name: 'Front Squat', sets: 5, reps: '5', rest: '240s' },
                    { name: 'Incline Bench Press', sets: 5, reps: '5', rest: '240s' },
                    { name: 'Romanian Deadlift', sets: 5, reps: '6', rest: '180s' },
                    { name: 'T-Bar Row', sets: 4, reps: '8', rest: '120s' }
                ]
            }
        };

        const levelWorkouts = workouts[level.toLowerCase()] || workouts.beginner;

        if (days >= 4) {
            plan.push({ day: daysOfWeek[0], exercises: levelWorkouts.day1, notes: 'Squat & Bench Focus' });
            plan.push({ day: daysOfWeek[2], exercises: levelWorkouts.day2, notes: 'Deadlift & Press Focus' });
            plan.push({ day: daysOfWeek[4], exercises: levelWorkouts.day3 || levelWorkouts.day1, notes: 'Volume Day' });
            if (days >= 5) {
                plan.push({ day: daysOfWeek[5], exercises: levelWorkouts.day2, notes: 'Accessory Work' });
            }
        } else if (days === 3) {
            plan.push({ day: daysOfWeek[0], exercises: levelWorkouts.day1, notes: 'Squat & Bench Focus' });
            plan.push({ day: daysOfWeek[2], exercises: levelWorkouts.day2, notes: 'Deadlift & Press Focus' });
            plan.push({ day: daysOfWeek[4], exercises: levelWorkouts.day3 || levelWorkouts.day1, notes: 'Volume Day' });
        } else {
            plan.push({ day: daysOfWeek[0], exercises: levelWorkouts.day1, notes: 'Squat & Bench Focus' });
            if (days === 2) {
                plan.push({ day: daysOfWeek[3], exercises: levelWorkouts.day2, notes: 'Deadlift & Press Focus' });
            }
        }

        return plan;
    }

    // Endurance: High Rep, Low Weight
    generateEndurancePlan(days, time, level) {
        const plan = [];
        const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        
        const endurance = {
            beginner: [
                { name: 'Cardio (Running/Cycling)', sets: 1, reps: '20 min', rest: '-' },
                { name: 'Bodyweight Squats', sets: 3, reps: '20', rest: '45s' },
                { name: 'Push-ups', sets: 3, reps: '15', rest: '45s' },
                { name: 'Lunges', sets: 3, reps: '15 each', rest: '45s' },
                { name: 'Plank', sets: 3, reps: '45s', rest: '60s' }
            ],
            intermediate: [
                { name: 'Cardio (Running/Cycling)', sets: 1, reps: '30 min', rest: '-' },
                { name: 'Goblet Squats', sets: 4, reps: '25', rest: '45s' },
                { name: 'Push-ups', sets: 4, reps: '25', rest: '45s' },
                { name: 'Walking Lunges', sets: 4, reps: '20 each', rest: '45s' },
                { name: 'Jump Rope', sets: 4, reps: '2 min', rest: '60s' },
                { name: 'Mountain Climbers', sets: 4, reps: '60s', rest: '60s' }
            ],
            advanced: [
                { name: 'Interval Running', sets: 1, reps: '45 min', rest: '-' },
                { name: 'High Rep Squats', sets: 5, reps: '30-50', rest: '60s' },
                { name: 'High Rep Push-ups', sets: 5, reps: '30-50', rest: '60s' },
                { name: 'Burpees', sets: 5, reps: '20', rest: '45s' },
                { name: 'Kettlebell Swings', sets: 5, reps: '30', rest: '45s' },
                { name: 'Battle Ropes', sets: 5, reps: '90s', rest: '60s' }
            ]
        };

        const workout = endurance[level.toLowerCase()] || endurance.beginner;

        for (let i = 0; i < days; i++) {
            plan.push({
                day: daysOfWeek[i],
                exercises: workout,
                notes: 'Endurance Training - Focus on sustained effort with minimal rest'
            });
        }

        return plan;
    }

    // Get user schedules
    async getUserSchedules(userId) {
        try {
            return await scheduleDao.getLatestScheduleByUserId(userId);
        } catch (error) {
            throw new Error(`Error getting user schedules: ${error.message}`);
        }
    }

    // Delete schedule
    async deleteSchedule(scheduleId) {
        try {
            return await scheduleDao.deleteSchedule(scheduleId);
        } catch (error) {
            throw new Error(`Error deleting schedule: ${error.message}`);
        }
    }
}

module.exports = new ScheduleService();