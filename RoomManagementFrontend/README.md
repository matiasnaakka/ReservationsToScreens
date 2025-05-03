# Room Management Frontend

## Overview

The Room Management Frontend is a React-based web application designed to manage and configure room data for Metropolia campuses. It provides an intuitive interface for administrators to set up, edit, and manage room and campus business hours data. The application integrates with Firebase for authentication and Firestore for data storage.

Key Features:
- User authentication with admin rights verification.
- Room and campus data management, including adding, editing, and deleting entries.
- Business hours configuration for campuses.
- Responsive design for seamless use across devices.

---

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Firebase project credentials

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd RoomManagementFrontend
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

5. Open the application in your browser:
   ```
   http://localhost:5173
   ```

### Build for Production
To build the application for production:
```bash
npm run build
```
The production-ready files will be available in the `dist` directory.

---

## Architecture

The application follows a modular architecture with the following structure:

- **Components**: Reusable React components for UI elements like `RoomsAccordion`, `CampusAccordion`, and `Header`.
- **Views**: Pages such as `Dashboard`, `Setup`, and `Edit` for managing room and campus data.
- **Config**: Firebase configuration and initialization.
- **Assets**: Static files such as images and icons.
- **Routes**: React Router is used for client-side routing.

Key Files:
- `src/App.jsx`: The main application component that handles routing and rendering.
- `src/views/main/Setup.jsx`: Handles initial system configuration and data import.
- `src/views/main/Edit.jsx`: Provides an interface for editing room and campus data.
- `src/views/main/Dashboard.jsx`: The main dashboard for navigation.

---

## Languages

The application is built using the following languages:
- **JavaScript (ES6+)**: For application logic and React components.
- **CSS**: For styling, with TailwindCSS for utility-first design.
- **HTML**: For the base structure of the application.

---

## Development Technology Stack and Prerequisites

### Technology Stack
- **React**: Frontend library for building user interfaces.
- **Vite**: Fast build tool and development server.
- **TailwindCSS**: Utility-first CSS framework for styling.
- **Firebase**: For authentication and Firestore database.
- **React Router**: For client-side routing.
- **Material-UI**: For UI components like accordions.

### Prerequisites
- **Node.js**: Required to run the development server and build the application.
- **npm or yarn**: For managing dependencies.
- **Firebase Project**: To store room and business hours data.

---

For more details, refer to the source code and inline comments in the project files.