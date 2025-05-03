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

The project is structured into four main components:

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
   - Designed for both large displays

4. **RoomManagementFrontend**:
   - A React-based web application for managing room and campus data.
   - Allows administrators to configure room details and business hours.
   - Integrates with Firebase for authentication and data storage.

---

## Development Prerequisites

To set up and run the project, ensure you have the following:

- **Node.js** (v21.0.0 or higher): Required for running the development servers and building the applications.
- **npm or yarn**: For managing dependencies.
- **Firebase Project**: To store room and business hours data.
- **Metropolia Open Data API Key**: For accessing room reservation data.
- **Modern Browser**: For testing the frontend applications.

---

## Links to Component Documentation

- [Backend API Documentation](./backend-api/README.md)
- [InfoScreenSvelte Documentation](./infoscreensvelte/README.md)
- [InfoScreenReact Documentation](./infoscreenreact/README.md)
- [RoomManagementFrontend Documentation](./RoomManagementFrontend/README.md)

---

## Links to Component Documentation

- [Metropolia Open Data Documentation (wiki.metropolia.fi)](https://wiki.metropolia.fi/display/opendata/Varaukset)

--

## Contributors

- [Aleksi Nokelainen](https://github.com/Krugou)
- [Matias Naakka](https://github.com/matiasnaakka)

For detailed setup instructions and usage guidelines, refer to the individual README files linked above.
