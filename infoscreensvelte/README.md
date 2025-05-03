# InfoScreen - Interactive Room Management System

InfoScreen is a modern, interactive room management and visualization system built with SvelteKit. It provides real-time room availability information and interactive floor plans for large facilities.

## Overview

InfoScreen is designed to help users navigate and manage room reservations in large buildings efficiently. Built with SvelteKit and TypeScript, it offers a responsive and intuitive interface for viewing room availability, making reservations, and visualizing floor plans.

### Technology Stack

- **Frontend Framework**: SvelteKit
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Testing**: Playwright & Vitest
- **API**: Express.js
- **Visualization**: Three.js for 3D floor plans

### Core Features

- **Real-time Updates**: Live room availability status
- **Interactive Maps**: Dynamic floor plan visualization
- **Multi-building Support**: Manage multiple buildings and floors
- **Responsive Design**: Works on various screen sizes
- **Automated Testing**: Comprehensive test suite with Playwright

## Installation

```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
npm install

# Start development server
npm run dev
```

# InfoScreen Project Structure

## Source Code Structure (`/src`)

### Components (`/src/components`)

- `Header/` - Header components for navigation and title display
  - `Header.svelte` - Main header component
  - `Navigation.svelte` - Navigation menu component
- `Map/` - Map visualization components
  - `MapView.svelte` - Main map component
  - `FloorPlan.svelte` - Floor plan visualization
  - `RoomMarker.svelte` - Room markers on map
- `Reservations/` - Reservation related components
  - `ReservationList.svelte` - List of room reservations
  - `ReservationCard.svelte` - Individual reservation display

### Routes (`/src/routes`)

- `+page.svelte` - Main page component
- `+layout.svelte` - Root layout component
- `rooms/` - Room-related routes
  - `+page.svelte` - Rooms overview
  - `[id]/+page.svelte` - Individual room view

### Stores (`/src/stores`)

- `wallsStore.ts` - Wall coordinates and floor plan data
- `activityStore.ts` - User activity tracking
- `reservationStore.ts` - Reservation management
- `roomStore.ts` - Room data management

### Lib (`/src/lib`)

- `utils/` - Utility functions
  - `api.ts` - API communication helpers
  - `dateUtils.ts` - Date manipulation functions
  - `mapUtils.ts` - Map calculation utilities
- `types/` - TypeScript type definitions
  - `Room.ts` - Room-related types
  - `Reservation.ts` - Reservation-related types
  - `Map.ts` - Map-related types

### Static (`/src/static`)

- `images/` - Image assets
- `icons/` - Icon assets
- `styles/` - Global styles

### API (`/src/api`)

- `coordsApi.js` - Wall coordinates API endpoints
- `roomsApi.js` - Room management API endpoints
- `reservationsApi.js` - Reservation handling endpoints

## Key Features

- Interactive floor plan visualization
- Real-time room reservation status
- Multi-floor navigation
- Room availability tracking
- User activity monitoring
