# Metrics Tracking System

A NestJS application for tracking distance and temperature metrics with support for different units of measurement.

## Features

- Track Distance metrics (Meter, Centimeter, Inch, Feet, Yard)
- Track Temperature metrics (Celsius, Fahrenheit, Kelvin)
- Add new metrics with Date, Value, and Unit
- Get a list of all metrics by type (Distance/Temperature)
- Get metrics data for charts, with the latest entry per day for a specific time period
- Automatic unit conversion when requesting metrics
- Interactive API documentation with Swagger

## Prerequisites

- Node.js (version 16 or higher)
- PostgreSQL

## Installation

1. Clone the repository
2. Install dependencies

```bash
npm install
```

3. Configure PostgreSQL connection in src/app.module.ts (if needed)
4. Start the application

```bash
npm run start:dev
```

5. Access the Swagger documentation at:

```
http://localhost:3000/api
```

## API Endpoints

### Add Distance Metric

```
POST /metrics/distance
```

Example request body:

```json
{
  "userId": "user123",
  "date": "2023-10-15T14:30:00Z",
  "value": 5.5,
  "unit": "METER"
}
```

### Add Temperature Metric

```
POST /metrics/temperature
```

Example request body:

```json
{
  "userId": "user123",
  "date": "2023-10-15T14:30:00Z",
  "value": 25.5,
  "unit": "CELSIUS"
}
```

### Get Metrics

```
GET /metrics?userId=user123&type=DISTANCE&distanceUnit=METER
```

Query parameters:

- `userId`: User's ID (required)
- `type`: Metric type, either "DISTANCE" or "TEMPERATURE" (required)
- `distanceUnit`: Target unit for distance metrics (optional)
- `temperatureUnit`: Target unit for temperature metrics (optional)

### Get Chart Data

```
GET /metrics/chart?userId=user123&type=DISTANCE&months=1&distanceUnit=METER
```

Query parameters:

- `userId`: User's ID (required)
- `type`: Metric type, either "DISTANCE" or "TEMPERATURE" (required)
- `months`: Time period in months, either "1" or "2" (required)
- `distanceUnit`: Target unit for distance metrics (optional)
- `temperatureUnit`: Target unit for temperature metrics (optional)

## Unit Conversions

The system supports automatic conversions between the following units:

### Distance Units

- Meter (base unit)
- Centimeter
- Inch
- Feet
- Yard

### Temperature Units

- Celsius
- Fahrenheit
- Kelvin

## Documentation

The API is fully documented using Swagger. After starting the application, you can access the interactive documentation at:

```
http://localhost:3000/api
```

This documentation allows you to:

- Explore all available endpoints
- View request/response schemas
- Test API calls directly from the browser
- Understand all available parameters and their types

## Test Data Scripts

The project includes scripts to help you populate your database with test metrics data. These scripts are useful for development, testing, and demonstration purposes.

### Prerequisites

- Make sure your API server is running locally on port 3000
- Node.js and npm installed

### Available Scripts

#### Distance Metrics

The `insert-distance-metrics.js` script will insert 60 distance metric records into the database with progressively increasing values.

```bash
# Navigate to the test/scripts directory
cd test/scripts

# Run the script
node insert-distance-metrics.js
```

This will create 60 distance records starting from 170.5 cm, with each record 0.5 cm larger than the previous one. Records are spaced 12 hours apart starting from the date specified in the script.

#### Temperature Metrics

The `insert-temperature-metrics.js` script will insert temperature metric records into the database.

```bash
# Navigate to the test/scripts directory
cd test/scripts

# Run the script
node insert-temperature-metrics.js
```

This will populate your database with temperature records according to the pattern defined in the script.
