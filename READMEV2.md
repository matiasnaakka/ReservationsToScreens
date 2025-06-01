# ReservationsToScreens

[![Build Status](#)](#) [![Node Version](https://img.shields.io/badge/node-20.x-brightgreen)](https://nodejs.org/en/) [![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## Table of Contents
- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Screenshots & Diagrams](#screenshots--diagrams)
- [Prerequisites](#prerequisites)
- [Installation Instructions](#installation-instructions)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Deployment Instructions](#deployment-instructions)
- [Service Details](#service-details)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Contact Information](#contact-information)

---

## Project Overview
ReservationsToScreens is a multi-service system for managing and displaying real-time room reservations at Metropolia Karaportti campus. It integrates with Metropolia's Open Data API and Firebase Firestore, providing:
- Real-time room availability and reservation updates
- Interactive info screens (React & Svelte frontends)
- Room and campus management UI
- Secure API with JWT and API key authentication

---

## Architecture
The system consists of several services:

- **Backend API** (`/production`):
  - Express.js API, MongoDB (Mongoose), JWT & API key authentication
  - Integrates with Metropolia OpenData API
- **InfoScreenReact** (`/infoscreenreact`):
  - React frontend for info screens
- **InfoScreenSvelte** (`/infoscreensvelte`):
  - Svelte frontend alternative
- **RoomManagementFrontend** (`/RoomManagementFrontend`):
  - React admin UI for room/campus/business hours management
- **Apache Config** (`/serverside`):
  - Reverse proxy, SSL, and static asset serving

![Architecture Diagram](./static/fileStructure.png)

---

## Screenshots & Diagrams
- [System Architecture](static/fileStructure.png)
- [Sample Info Screen](static/playlist.png)
- [Room Management UI](static/operations.png)

---

## Prerequisites
- **Node.js**: v20.x required ([download](https://nodejs.org/en/))
- **MongoDB**: Running instance (local or remote)
- **Apache**: For reverse proxy and SSL (see `/serverside/selfsigned.conf`)
- **npm**: For dependency management
- **Metropolia OpenData API Key**
- **.env** files for each service (see [Configuration](#configuration))

---

## Installation Instructions
1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ReservationsToScreens
   ```
2. **Install dependencies for all services:**
   ```bash
   npm run install:all
   ```
3. **Configure environment variables:**
   - Copy `/production/.env.example` to `/production/.env` and fill in values:
     ```env
     APIKEYMETROPOLIA="application_key_here"
     PASSWORDMETROPOLIA="your_password_here"
     JWT_SECRET="your_jwt_secret"
     DEV_USER="dev_username_here"
     DEV_PASSWORD="dev_password_here"
     ```
   - Repeat for other services as needed (see their README.md files).
4. **Database setup & initial data:**
   - Ensure MongoDB is running and accessible.
   - Load initial data:
     ```bash
     cd production
     node firstStart.js
     ```
   - This imports `data/rooms.json` and `data/businesshours.json`.
5. **SSL certificate for development:**
   - Use `/serverside/selfsigned.conf` as a template for Apache SSL config.
   - Place certs at `/etc/ssl/selfsigned/selfsigned.crt` and `.key`.

---

## Development Setup
- **Run all services in development mode:**
  ```bash
  npm run dev
  ```
- **Individual service dev commands:**
  - Backend API: `cd production && npm run dev`
  - InfoScreenReact: `cd infoscreenreact && npm run dev`
  - InfoScreenSvelte: `cd infoscreensvelte && npm run dev`
  - RoomManagementFrontend: `cd RoomManagementFrontend && npm run dev`
- **Port assignments:**
  - InfoScreen Frontend (React): `3001`
  - InfoScreen Svelte: `3002`
  - InfoScreen API: `3003`
  - Room Management: `3004`
  - Dev ports: `3005-3007`
- **Available npm scripts:**
  - `dev`, `build`, `start`, `pm2:start`, `pm2:stop`, `pm2:restart`, etc. (see each `package.json`)

---

## Project Structure
```
/production                # Backend API, server, data, models, routes
/infoscreenreact           # React frontend for info screens
/infoscreensvelte          # Svelte frontend alternative
/RoomManagementFrontend    # Room management/admin UI
/serverside                # Apache config, SSL
```
- See each subfolder's README for more details.

---

## API Documentation
### Authentication
- All API endpoints require an `apikey` header (see `.env`).
- Some endpoints require JWT in `Authorization: Bearer <token>` header.

### Example: Fetch all rooms
```bash
curl -H "apikey: <APIKEY>" http://localhost:3003/api/rooms/all
```

### Example: Get reservations for a room
```bash
curl -H "apikey: <APIKEY>" "http://localhost:3003/api/reservations?room=KM123&startDate=2024-06-01&endDate=2024-06-02"
```

### Example: Update campus business hours
```bash
curl -X PUT -H "Content-Type: application/json" -H "apikey: <APIKEY>" -H "Authorization: Bearer <JWT>" \
  -d '{"campusShorthand":"KM","hours":{...}}' http://localhost:3003/api/campus/hours/update
```

### Endpoints
- `/api/rooms/all` - List all rooms
- `/api/rooms/freespace-full` - Filtered room search
- `/api/reservations` - Get reservations for a room
- `/api/businesshours` - Get business hours
- `/api/campuses/hours` - Get all campus business hours
- `/api/campus/hours/update` - Update campus hours (PUT)
- `/api/login` - Obtain JWT
- `/api/token/validate` - Validate JWT
- `/api/karamalmi/rooms` - List Karamalmi rooms

### Rate Limiting
- No explicit rate limiting, but abuse may result in IP ban.

---

## Deployment Instructions
1. **Build all frontends:**
   ```bash
   npm run build:all
   ```
2. **Start all services with PM2:**
   ```bash
   npm run pm2:start
   ```
   - Uses `production/ecosystem.config.cjs` for process management.
3. **Apache reverse proxy:**
   - Use `/serverside/selfsigned.conf` as a template.
   - Example routes:
     - `/svelte/` → `localhost:3002`
     - `/api/` → `localhost:3003`
     - `/roomsmanagement/` → `localhost:3004`
     - `/` → `localhost:3001`
4. **Environment-specific configs:**
   - Set `NODE_ENV=production` for production.
   - Ensure MongoDB is accessible from the server.

---

## Service Details
| Service                    | Port  | Description                        |
|----------------------------|-------|------------------------------------|
| Info Screen Frontend (React)| 3001 | Main info screen UI                |
| Info Screen Frontend (Svelte)| 3002| Svelte-based info screen           |
| Info Screen API            | 3003 | Backend API                        |
| Room Management            | 3004 | Admin UI for rooms/campuses        |
| Dev ports                  |3005-7| Used for local dev/test            |

---

## Configuration
### Environment Variables Reference (`/production/.env.example`)
```env
APIKEYMETROPOLIA="application_key_here"
PASSWORDMETROPOLIA="your_password_here"
JWT_SECRET="your_jwt_secret"
DEV_USER="dev_username_here"
DEV_PASSWORD="dev_password_here"
```
- **MONGODB_URI**: MongoDB connection string (default: `mongodb://localhost:27017/infoscreen`)
- **Other services**: See their `.env.example` or README for required variables.

### Business Hours & Campus Config
- Edit `production/data/businesshours.json` and `rooms.json` for initial data.
- Use RoomManagementFrontend UI for ongoing changes.

### MongoDB Connection
- Default: `mongodb://localhost:27017/infoscreen`
- Change via `MONGODB_URI` in `.env` if needed.

---

## Troubleshooting
- **Build fails:**
  - Run `npm install` in all subfolders
  - Check logs for errors
- **PM2 not starting:**
  - Check `production/ecosystem.config.cjs`
  - Ensure ports 3001-3007 are free
- **Frontend not loading:**
  - Check Apache proxy config and SSL certs
  - Verify frontend build output exists
- **API not responding:**
  - Check MongoDB connection and credentials
  - Review API logs for stack traces
- **Environment variables missing:**
  - Ensure `.env` files exist and are correctly populated
- **Service health checks:**
  - `pm2 status`, `pm2 logs`
- **Log file locations:**
  - PM2 logs: `~/.pm2/logs/`
  - Apache logs: `/var/log/apache2/`

---

## Contact Information
- **Primary Maintainer:** [Add Name & Email Here]
- **Backup Contact:** [Add Name & Email Here]
- **Escalation:** [Add escalation procedure or Slack channel]

---

> **Keep this document up to date with every major deployment or infrastructure change.**
