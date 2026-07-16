# Airline Voucher Seat Assignment

A web application to manage flight voucher seat assignments for airline promotional campaigns.

## 1. Prerequisites
Before running this project, ensure your system has:
* **Node.js** (v20.x or higher)
* **npm** (automatically installed with Node.js)
* **Docker** (optional, for container setup)

---

## 2. How to Run the Application (Locally)

### A. Backend Setup
1. Navigate to the backend folder: `cd backend`
2. Install dependencies: `npm install`
3. Start the server: `npm run start:dev`
   * Server runs at: `http://localhost:3000`

### B. Frontend Setup
1. Navigate to the frontend folder: `cd frontend`
2. Install dependencies: `npm install`
3. Start the server: `npm run dev`
   * Frontend runs at: `http://localhost:5173`

---

## 3. Docker Instructions
You can run the application in an isolated environment using Docker.

### Setup via Docker Compose (Recommended)
Run the following command in the root directory to start both services simultaneously:
```bash
docker-compose up --build
```

### The application will be available at:
* Frontend: http://localhost:5173
* Backend API: http://localhost:3000

## 4. API Documentation

Here are the available endpoints, their expected payloads, and sample responses. (Note: Depending on your global prefix setup, you might need to add /api before the paths, e.g., /api/generate).

### A. Get Aircraft Types
Retrieves the list of available aircraft types.

*Endpoint:* GET /api/aircrafts

*Response:*
json
{
  "success": true,
  "aircrafts": [
    {
      "type": "ATR",
    },
    {
      "type": "Airbus 320",
    }
  ]
}


### B. Check Voucher Existence
Checks whether voucher assignments already exist for a given flight and date.

*Endpoint:* POST /api/check

*Headers:* Content-Type: application/json

*Payload (Request Body):*
json
{
  "flightNumber": "GA-102",
  "date": "2025-07-12"
}


*Success Response (200 OK):*
json
{
  "success": true,
  "exists": true
}


### C. Generate Vouchers
Generates 3 random unique seats based on the aircraft layout and saves the record to the database.

*Endpoint:* POST /api/generate

*Headers:* Content-Type: application/json

*Payload (Request Body):*
json
{
  "name": "Sarah",
  "id": "CRW-007",
  "flightNumber": "GA-102",
  "date": "2025-07-12",
  "aircraft": "Airbus 320"
}


*Success Response (200/201 OK):*
json
{
  "success": true,
  "seats": ["3B", "7C", "14D"]
}


*Error Response (409 Conflict) - If vouchers already exist:*
json
{
  "message": "Vouchers have already been generated for flight number [flightNumber] on [date]",
  "error": "Conflict",
  "statusCode": 409
}