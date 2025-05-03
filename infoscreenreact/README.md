# Room Reservation Info Screen

## Application Overview

The Room Reservation Info Screen is a React-based application designed to display real-time room availability and reservation details for a campus. It provides an interface with features like floor maps, room filtering, and QR code integration for easy room reservations. The application supports multi-language functionality (English and Finnish) and is optimized for both large displays and smaller devices.

Key Features:
- Real-time room availability and reservation updates.
- Interactive SVG-based floor maps with color-coded room statuses.
- Filtering options for rooms reservable by students or staff.
- QR code generation for room reservations.
- Multi-language support (English and Finnish).
- Looping mode for unattended displays with automatic screen transitions.

---

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd infoscreenreact
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

- **Components**: Reusable React components for UI elements like `RoomList`, `RoomMap`, and `Instructions`.
- **Hooks**: Custom React hooks like `useAutoScroll` for managing state and behavior.
- **Assets**: Static files such as SVG floormaps, roomimages, and icons.
- **API**: Functions for fetching room and reservation data from the backend.
- **State Management**: Local state is managed using React's `useState` and `useEffect` hooks.

Key Files:
- `src/App.jsx`: The main application component that handles routing, state management, and rendering.
- `src/components/RoomList.jsx`: Displays a list of rooms with filtering and QR code integration.
- `src/components/RoomMap.jsx`: Renders an interactive SVG map with room statuses.
- `src/main.jsx`: Entry point for the React application.

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
- **React Router**: For client-side routing.
- **QRCode.react**: For generating QR codes.
- **FontAwesome**: For icons.

### Prerequisites
- **Node.js**: Required to run the development server and build the application.
- **npm or yarn**: For managing dependencies.
- **Browser**: A modern browser like Chrome or Firefox for testing the application.

