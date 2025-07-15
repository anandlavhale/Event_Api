# Event Management API

A comprehensive REST API for managing events and user registrations built with Node.js, Express, and PostgreSQL.

## Features

- **Event Management**: Create, read, update, and delete events with proper validation
- **User Management**: Full CRUD operations for users
- **Registration System**: Register/cancel registrations with business logic enforcement
- **Advanced Queries**: Get upcoming events with custom sorting, event statistics
- **Data Integrity**: Proper PostgreSQL relationships and constraints
- **Security**: Rate limiting, input validation, and error handling
- **Logging**: Comprehensive logging with Winston
- **Concurrency**: Safe handling of concurrent operations

## Tech Stack

- **Runtime**: Node.js with ES modules
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Validation**: Joi
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate limiting

## Project Structure

```
src/
├── config/
│   ├── database.js      # Database connection configuration
│   └── logger.js        # Winston logger configuration
├── controllers/
│   ├── eventController.js
│   ├── userController.js
│   └── registrationController.js
├── models/
│   ├── Event.js         # Event model with business logic
│   ├── User.js          # User model
│   └── Registration.js  # Registration model with constraints
├── routes/
│   ├── eventRoutes.js
│   ├── userRoutes.js
│   ├── registrationRoutes.js
│   └── index.js
├── middleware/
│   └── errorHandler.js  # Global error handling
├── utils/
│   └── validation.js    # Joi validation schemas
├── scripts/
│   ├── migrate.js       # Database migration script
│   └── seed.js          # Sample data seeding
└── server.js            # Main application entry point
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd event-management-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file with your database credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=event_management
   DB_USER=postgres
   DB_PASSWORD=your_password
   PORT=3000
   NODE_ENV=development
   ```

4. **Create PostgreSQL database**
   ```sql
   CREATE DATABASE event_management;
   ```

5. **Run database migrations**
   ```bash
   npm run db:migrate
   ```

6. **Seed the database (optional)**
   ```bash
   npm run db:seed
   ```

7. **Start the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

The API will be available at `http://localhost:3000/api/v1`

## API Endpoints

### Events

#### Create Event
```http
POST /api/v1/events
Content-Type: application/json

{
  "title": "Tech Conference 2024",
  "date_time": "2025-12-15T10:00:00.000Z",
  "location": "San Francisco, CA",
  "capacity": 500
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "eventId": 1
  },
  "message": "Event created successfully"
}
```

#### Get Event Details
```http
GET /api/v1/events/1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Tech Conference 2024",
    "date_time": "2024-12-15T10:00:00.000Z",
    "location": "San Francisco, CA",
    "capacity": 500,
    "created_at": "2025-07-15T00:00:00.000Z",
    "updated_at": "2025-07-15T00:00:00.000Z",
    "registrations": [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "registered_at": "2025-07-15T00:00:00.000Z"
      }
    ]
  }
}
```

#### List Upcoming Events
```http
GET /api/v1/events/upcoming
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Tech Conference 2024",
      "date_time": "2025-10-15T10:00:00.000Z",
      "location": "San Francisco, CA",
      "capacity": 500,
      "registration_count": "2"
    }
  ],
  "count": 1
}
```

#### Get Event Statistics
```http
GET /api/v1/events/1/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalRegistrations": 25,
    "remainingCapacity": 475,
    "percentageUsed": 5.00
  }
}
```

### Users

#### Create User
```http
POST /api/v1/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}
```

#### Get All Users
```http
GET /api/v1/users
```

#### Get User by ID
```http
GET /api/v1/users/1
```

### Registrations

#### Register for Event
```http
POST /api/v1/registrations
Content-Type: application/json

{
  "userId": 1,
  "eventId": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "event_id": 1,
    "registered_at": "2025-10-01T00:00:00.000Z"
  },
  "message": "Successfully registered for event"
}
```

#### Cancel Registration
```http
DELETE /api/v1/registrations
Content-Type: application/json

{
  "userId": 1,
  "eventId": 1
}
```

#### Get User Registrations
```http
GET /api/v1/registrations/user/1
```

#### Get Event Registrations
```http
GET /api/v1/registrations/event/1
```

## Business Logic Rules

### Event Creation
- Title must be 3-255 characters
- Date must be in ISO format and in the future
- Location must be 3-255 characters
- Capacity must be between 1 and 1000

### User Registration
- Cannot register for the same event twice
- Cannot register for past events
- Cannot register if event is at capacity
- User and event must exist

### Data Validation
- All inputs are validated using Joi schemas
- Proper error messages for validation failures
- SQL injection prevention through parameterized queries

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "error": "Event not found"
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors, business logic violations)
- `404` - Not Found
- `409` - Conflict (duplicate resources)
- `429` - Too Many Requests (rate limiting)
- `500` - Internal Server Error

## Security Features

- **Rate Limiting**: 100 requests per 15-minute window
- **Input Validation**: Joi schemas for all inputs
- **SQL Injection Prevention**: Parameterized queries
- **CORS**: Cross-origin resource sharing configured
- **Helmet**: Security headers
- **Request Logging**: All requests logged for monitoring

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Events Table
```sql
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  date_time TIMESTAMP NOT NULL,
  location VARCHAR(255) NOT NULL,
  capacity INTEGER NOT NULL CHECK (capacity > 0 AND capacity <= 1000),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Registrations Table
```sql
CREATE TABLE registrations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, event_id)
);
```

## Performance Optimizations

- **Database Indexes**: Optimized queries with proper indexing
- **Connection Pooling**: PostgreSQL connection pool for better performance
- **Query Optimization**: Efficient JOIN queries and aggregations
- **Compression**: Response compression middleware
- **Request Logging**: Async logging to avoid blocking

## Testing

Run tests with:
```bash
npm test
```

## Deployment

The API is ready for production deployment with:
- Environment-based configuration
- Graceful shutdown handling
- Security headers
- Rate limiting
- Comprehensive logging

