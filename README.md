# 🏫Realtime room reservations

## Project Overview

Realtime room reservations is a collaboration project made by Aleksi Nokelainen and Matias Naakka. It's designed to manage and display room reservations at Metropolia Karaportti campus info screens. It consists of multiple components, including backend services and frontend applications, to provide real-time room availability and reservation details. The system integrates with Metropolia's Open Data API and Firebase Firestore to fetch and manage data.

### Key Features
- Real-time room availability and reservation updates.
- Interactive and responsive web applications for room management and display.
- Integration with Metropolia's Open Data API and Firebase Firestore.
- Multi-language support (English and Finnish).

---

## Architecture

The project is structured into five main components:

1. **Backend API**:
   - Provides data and functionality for the frontend applications.
   - Fetches room details from Firebase Firestore.
   - Retrieves room reservations from Metropolia's Open Data API.
   - Serves as the central data hub for the system.

2. **InfoScreenSvelte**:
   - A Svelte-based web application for displaying room reservations.
   - Features interactive floor plans and real-time updates.
   - Optimized for large displays and digital signage.

3. **InfoScreenReact**:
   - A React-based web application for displaying room reservations.
   - Includes features like QR code integration and room filtering.
   - Designed for both large displays and smaller screens

4. **RoomManagementFrontend**:
   - A React-based web application for managing room and campus data.
   - Allows administrators to configure room details and business hours.
   - Integrates with authentication for secure access to management features.

5. **Production**:
   - Contains the production-ready code deployed on the server.
   - Includes the Express.js API server with MongoDB integration.
   - Features authentication middleware for securing API endpoints.
   - Contains PM2 configuration for process management in production.
   - Provides centralized server-side logic for all components.

---

## Development Prerequisites

To set up and run the project, ensure you have the following:

- **Node.js** (v21.0.0 or higher): Required for running the development servers and building the applications.
- **npm or yarn**: For managing dependencies.
- **MongoDB**: Required for the production environment to store room and business hours data.
- **Metropolia Open Data API Key**: For accessing room reservation data.
- **Modern Browser**: For testing the frontend applications.

### Production Prerequisites

For deploying the application to a production environment:

- **PM2**: Process manager for Node.js applications to keep them alive in production.
- **MongoDB**: Database for storing room and business hours data.
- **Environment Variables**: Set up appropriate environment variables as described in [DEPLOYMENT.md](./DEPLOYMENT.md).
- **SSL Certificates**: For securing the application in production.

---

## Links to Component Documentation

- [Backend API Documentation](./backend-api/README.md)
- [InfoScreenSvelte Documentation](./infoscreensvelte/README.md)
- [InfoScreenReact Documentation](./infoscreenreact/README.md)
- [RoomManagementFrontend Documentation](./RoomManagementFrontend/README.md)
- [Production Deployment Guide](./DEPLOYMENT.md)

---

## Production Architecture

The `production` directory contains the server-side code deployed in production. Key components include:

- **infoScreenApi.js**: Main Express.js server file handling API requests and authentication.
- **ecosystem.config.cjs**: PM2 configuration for process management.
- **middleware/auth.js**: Authentication middleware to secure API endpoints.
- **models/**: Mongoose models for MongoDB data schemas.
- **routes/**: API route handlers for various endpoints.
- **utils/**: Utility functions including constants, logging, and API helpers.

For detailed deployment instructions, refer to the [Production Deployment Guide](./DEPLOYMENT.md).

---

## Metropolia Open data documentation

- [Metropolia Open Data Documentation (wiki.metropolia.fi)](https://wiki.metropolia.fi/display/opendata/Varaukset)

## Contributors

- [Aleksi Nokelainen](https://github.com/Krugou)
- [Matias Naakka](https://github.com/matiasnaakka)

For detailed setup instructions and usage guidelines, refer to the individual README files linked above.
