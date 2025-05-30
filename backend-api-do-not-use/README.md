# Backend API Documentation

## Overview

The Backend API is a Node.js-based server that provides data and functionality for the Room Reservation Info Screen application. It integrates with external APIs, such as Metropolia's OpenData API, and Firebase Firestore to fetch and manage room reservation data. The API supports features like room filtering, reservation checking, and business hours retrieval.

Key Features:
- Fetch real-time room reservation data from Metropolia's OpenData API.
- Retrieve room and business hours data from Firebase Firestore.
- Provide endpoints for filtering and querying room availability.
- Secure API access with API key authentication.

---

## How to Get Started

### Prerequisites
- Node.js (v21.0.0 or higher)
- npm or yarn package manager
- Firebase project credentials
- Metropolia OpenData API key

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd backend-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the root directory.
   - Add the required environment variables (refer to `.env.example` for guidance).

4. Start the development server:
   ```bash
   npm run dev
   ```

5. The API will be available at:
   ```
   http://localhost:3000
   ```

### Running in Production
To run the API in production mode:
1. Build the project (if applicable).
2. Start the server using a process manager like PM2:
   ```bash
   pm2 start ecosystem.config.js --env production
   ```

---

## Development Technology Stack and Prerequisites

### Technology Stack
- **Node.js**: JavaScript runtime for building the server.
- **Express.js**: Web framework for creating API endpoints.
- **Firebase Admin SDK**: For interacting with Firebase Firestore and authentication.
- **dotenv**: For managing environment variables.
- **PM2**: Process manager for running the server in production.

### Prerequisites
- **Node.js**: Required to run the server and manage dependencies.
- **npm or yarn**: For installing and managing dependencies.
- **Firebase Project**: To store room and business hours data.
- **Metropolia OpenData API Key**: For accessing room reservation data.

---

For more details, refer to the source code and inline comments in the project files.