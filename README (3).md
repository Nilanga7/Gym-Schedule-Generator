# Gym Schedule Manager - Progress Tracking Module

**Author:** S.M.R.Kaweeshwara - 23IT0492

## Overview

This is the progress tracking module of the Gym Schedule Manager application. It provides a comprehensive backend system for managing and tracking user fitness progress, including weight tracking, lifting data, and workout notes.

## Project Structure

```
backend/
├── dao/
│   └── progressDao.js         # Data Access Object layer for progress data
├── routes/
│   └── progressRoutes.js      # API route handlers for progress endpoints
└── services/
    └── progressService.js     # Business logic layer for progress operations
```

## Features Implemented

### 1. **Progress Data Access Layer** (`dao/progressDao.js`)

The ProgressDao class provides database operations for progress tracking:

- **createProgress(userId, date, weight, liftData, notes)** - Creates a new progress entry with user information, date, weight, lifting data, and optional notes
- **getProgressByUserId(userId)** - Retrieves all progress entries for a specific user, ordered by date (newest first)
- **getProgressByDateRange(userId, startDate, endDate)** - Retrieves progress entries within a specified date range
- **getProgressById(progressId)** - Fetches a specific progress entry by its ID
- **updateProgress(progressId, weight, liftData, notes)** - Updates an existing progress entry
- **deleteProgress(progressId)** - Removes a progress entry from the database
- **getLatestWeight(userId)** - Retrieves the most recent weight recorded for a user
- **getProgressCount(userId)** - Returns the total number of progress entries for a user

**Database Schema:**
- `progress_id` - Primary key
- `user_id` - Reference to user
- `date` - Date of progress entry
- `weight` - User's weight (optional)
- `lift_data` - JSON object containing lifting exercise data
- `notes` - Additional notes about the workout

### 2. **API Routes** (`routes/progressRoutes.js`)

RESTful API endpoints for progress tracking operations:

#### Create Progress
- **POST** `/` - Log a new progress entry
  - Required: `userId`, `date`
  - Optional: `weight`, `liftData`, `notes`
  - Response: `{ message, progressId }`

#### Retrieve Progress Data
- **GET** `/user/:userId` - Get all progress entries for a user
- **GET** `/charts/:userId` - Get progress data formatted for chart visualization
- **GET** `/stats/:userId` - Get progress statistics for a user

#### Update Progress
- **PUT** `/:id` - Update an existing progress entry
  - Parameters: `weight`, `liftData`, `notes`

#### Delete Progress
- **DELETE** `/:id` - Remove a progress entry

### 3. **Business Logic Layer** (`services/progressService.js`)

The service layer contains the following methods:
- `logProgress()` - Handles creation of new progress entries
- `getUserProgress()` - Retrieves user progress data
- `getProgressForCharts()` - Prepares data for visualization
- `getProgressStats()` - Calculates progress statistics
- `updateProgress()` - Updates progress information
- `deleteProgress()` - Removes progress entries

## Key Technologies

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework for API routing
- **SQLite** - Database (via db module)
- **JSON** - Data format for lifting exercise data storage

## API Usage Examples

### Log Progress
```json
POST /
{
  "userId": 1,
  "date": "2025-11-16",
  "weight": 75.5,
  "liftData": {
    "bench_press": { "sets": 3, "reps": 8, "weight": 100 },
    "squats": { "sets": 3, "reps": 10, "weight": 120 }
  },
  "notes": "Great workout today!"
}
```

### Get User Progress
```
GET /user/1
```

### Get Progress Statistics
```
GET /stats/1
```

### Update Progress
```json
PUT /1
{
  "weight": 76,
  "liftData": { "bench_press": { "sets": 3, "reps": 9, "weight": 105 } },
  "notes": "Updated progress"
}
```

### Delete Progress
```
DELETE /1
```

## Error Handling

All endpoints include comprehensive error handling with appropriate HTTP status codes:
- `400` - Bad Request (validation errors, client errors)
- `401` - Unauthorized (authentication failures)
- `404` - Not Found (resource not found)

## Database Connection

The module requires a `db` module located at `backend/config/db.js` which should provide:
- `runAsync(sql, params)` - Execute INSERT/UPDATE/DELETE queries
- `getAsync(sql, params)` - Fetch a single row
- `allAsync(sql, params)` - Fetch multiple rows

## Dependencies

- `express` - Web framework
- Database module (SQLite or similar)

## Notes

- Lifting data is stored as JSON strings in the database and automatically parsed/stringified by the DAO layer
- All date operations use ISO 8601 format (YYYY-MM-DD)
- Progress entries are sorted by date with most recent first
- The module is designed to be modular and follows the MVC pattern with DAO-Service-Route layers
