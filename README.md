# Gym Schedule Manager - Backend

A comprehensive backend service for generating and managing personalized workout schedules based on user fitness goals, experience levels, and availability.

**Author:** V.P.C.Rasanga - 23IT0521

---

## Overview

The Gym Schedule Manager backend is built using a layered architecture pattern that separates concerns across Data Access Objects (DAO), Services, and Routes. This system generates customized workout plans tailored to individual fitness goals and experience levels.

---

## Project Structure

```
backend/
├── dao/
│   └── scheduleDao.js          # Data Access Layer
├── routes/
│   └── scheduleRoutes.js       # API Routes
└── services/
    └── scheduleService.js      # Business Logic Layer
```

---

## Features Implemented

### 1. **Schedule Generation** 
Generates personalized workout schedules based on:
- **Fitness Goals:**
  - Muscle Gain
  - Fat Loss
  - Strength
  - Endurance

- **Experience Levels:**
  - Beginner
  - Intermediate
  - Advanced

- **User Parameters:**
  - Age
  - Gender
  - Available training days (1-7 days/week)
  - Available time per session
  - Experience level

### 2. **Four Specialized Workout Plans**

#### **Muscle Gain Plan** (Push/Pull/Legs Split)
- Tailored exercises for muscle hypertrophy
- Progressive overload recommendations
- Varying intensity based on experience level
- Rest periods optimized for muscle recovery

#### **Fat Loss Plan** (HIIT & Circuit Training)
- High-Intensity Interval Training circuits
- Metabolic conditioning exercises
- Time-efficient workouts
- Minimal rest periods for cardiovascular benefit

#### **Strength Plan** (Heavy Compound Lifts)
- Focus on major compound movements (Squat, Bench Press, Deadlift)
- Progressive programming for strength development
- Extended rest periods for nervous system recovery
- Periodized approach for different experience levels

#### **Endurance Plan** (High Rep, Low Weight)
- Sustained effort training
- Cardiovascular conditioning
- High repetition ranges
- Minimal rest for muscular endurance

### 3. **Database Operations**
- Create and store workout schedules
- Retrieve schedules by user ID
- Fetch latest schedules (last 7 days)
- Delete individual or all user schedules
- Track schedule counts per user

### 4. **API Endpoints**

#### POST `/schedules/generate`
Generates a new workout schedule for a user.

**Request Body:**
```json
{
  "userId": "user123",
  "age": 25,
  "gender": "male",
  "goal": "muscle gain",
  "availableDays": 5,
  "availableTime": 60,
  "experienceLevel": "intermediate"
}
```

**Response:**
```json
{
  "message": "Schedule generated successfully",
  "schedule": [
    {
      "day": "Monday",
      "exercises": [...],
      "notes": "Push Day - Chest, Shoulders, Triceps"
    }
  ]
}
```

#### GET `/schedules/user/:userId`
Retrieves all user schedules (latest 7 records).

**Response:**
```json
[
  {
    "schedule_id": 1,
    "user_id": "user123",
    "goal": "muscle gain",
    "day": "Monday",
    "exercises": [...],
    "created_date": "2025-11-16T10:30:00Z"
  }
]
```

#### DELETE `/schedules/:id`
Deletes a specific workout schedule.

**Response:**
```json
{
  "message": "Schedule deleted successfully"
}
```

---

## Architecture

### Data Access Layer (`scheduleDao.js`)
- Handles all database operations
- CRUD operations for schedules
- Query abstraction
- Error handling for database operations

**Methods:**
- `createSchedule()` - Insert new schedule
- `getSchedulesByUserId()` - Fetch all user schedules
- `getLatestScheduleByUserId()` - Get last 7 schedules
- `getScheduleById()` - Fetch specific schedule
- `deleteSchedule()` - Remove a schedule
- `deleteUserSchedules()` - Remove all user schedules
- `getScheduleCount()` - Get total schedules for user

### Service Layer (`scheduleService.js`)
- Contains core business logic
- Generates customized workout plans
- Manages schedule creation workflow
- Implements specialized workout generation algorithms

**Key Methods:**
- `generateSchedule()` - Main schedule generation engine
- `generateMuscleGainPlan()` - PPL split generation
- `generateFatLossPlan()` - HIIT circuit generation
- `generateStrengthPlan()` - Compound lift programming
- `generateEndurancePlan()` - Cardio & endurance training
- `getUserSchedules()` - Service wrapper for retrieval
- `deleteSchedule()` - Service wrapper for deletion

### Route Layer (`scheduleRoutes.js`)
- Defines API endpoints
- Request validation
- Response formatting
- Error handling

**Features:**
- Input validation for required fields
- Proper HTTP status codes
- Comprehensive error messages
- Async/await pattern

---

## Workout Plan Details

### Exercise Information Structure
Each exercise includes:
- `name` - Exercise name
- `sets` - Number of sets
- `reps` - Repetition range or duration
- `rest` - Rest period between sets

### Muscle Gain Plan Variations
- **Beginner:** Basic 3-4 sets per exercise, moderate weights
- **Intermediate:** 3-5 sets with progressive overload
- **Advanced:** 4-6 sets with heavy weights and accessory work

### Fat Loss Plan Variations
- **Beginner:** 30-minute circuits with 30s rest
- **Intermediate:** 40+ minute sessions with minimal rest
- **Advanced:** Advanced plyometric and explosive movements

### Strength Plan Variations
- **Beginner:** Linear progression (5/3/1 style)
- **Intermediate:** Volume-based programming
- **Advanced:** Periodized heavy/volume/deload cycles

### Endurance Plan Variations
- **Beginner:** 20 minutes of cardio + bodyweight exercises
- **Intermediate:** 30 minutes of cardio + moderate intensity
- **Advanced:** 45+ minutes with high-intensity intervals

---

## Database Schema

```sql
CREATE TABLE schedules (
  schedule_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id VARCHAR(50) NOT NULL,
  goal VARCHAR(50) NOT NULL,
  available_days INT,
  available_time INT,
  day VARCHAR(20),
  exercises JSON,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Error Handling

The system implements comprehensive error handling:
- Database operation errors are caught and logged
- Invalid input validation before processing
- Meaningful error messages returned to clients
- Try-catch blocks throughout the stack

---

## Technologies Used

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** SQLite/MySQL
- **Language:** JavaScript (ES6+)
- **Async Pattern:** Async/Await

---

## Future Enhancements

- User preference customization
- Exercise difficulty ratings
- Rest day integration
- Progression tracking
- Nutritional recommendations
- Exercise form video integration
- Social sharing capabilities

---

## Notes

- Existing schedules are automatically deleted when a new one is generated for the user
- Latest 7 schedules are returned for user history
- Exercises are stored as JSON for flexibility
- All operations are asynchronous for better performance

---

## Installation & Setup

1. Ensure Node.js is installed
2. Install dependencies: `npm install`
3. Configure database connection in `config/db.js`
4. Set up the schedules table in your database
5. Start the server: `npm start`

---

**Version:** 1.0.0  
**Last Updated:** November 16, 2025
