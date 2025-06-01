# ReservationsToScreens Deployment Guide

## Table of Contents
- [Pre-deployment Checklist](#pre-deployment-checklist)
- [Deployment Process](#deployment-process)
- [Post-deployment Verification](#post-deployment-verification)
- [Rollback Procedures](#rollback-procedures)
- [Environment-specific Considerations](#environment-specific-considerations)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)
- [Contact Information](#contact-information)

---

## Pre-deployment Checklist

- [ ] **Code Review:**
  - All code changes must be reviewed and approved via pull request.
  - Ensure code follows project style guides and passes linting.
- [ ] **Testing Verification:**
  - All automated tests must pass (unit, integration, E2E if available).
  - Manual smoke tests for critical user flows.
- [ ] **Environment Preparation:**
  - Ensure all `.env` files are up to date for each service (see [Environment Variables](#environment-variables)).
  - Confirm server disk space and memory are sufficient.
  - Ensure you have SSH access and sudo privileges on the deployment server.
- [ ] **Backup Procedures:**
  - Backup MongoDB database: `mongodump --out ~/mongo_backups/$(date +%F)`
  - Backup current build artifacts and PM2 ecosystem config if needed.

---

## Deployment Process

1. **Git Operations**
   ```bash
   git pull
   ```
   - Pull the latest code from the main branch on the server.

2. **Build Process**
   ```bash
   npm run build:all
   ```
   - Builds all frontend projects (React, Svelte, Room Management).

3. **PM2 Process Management**
   ```bash
   npm run pm2:start
   ```
   - Starts/restarts all backend and frontend services using PM2 and the `production/ecosystem.config.cjs` config.

4. **Verification Steps**
   - Check PM2 status: `pm2 status`
   - Tail logs for errors: `pm2 logs`
   - See [Post-deployment Verification](#post-deployment-verification)

---

## Post-deployment Verification

- **Service Health Checks:**
  - Ensure all PM2 processes are online: `pm2 status`
  - Check logs for errors: `pm2 logs`
- **Frontend Accessibility Testing:**
  - Visit the main site, Svelte frontend, and Room Management UI via browser.
  - Confirm static assets load and UI is functional.
- **API Endpoint Validation:**
  - Test `/api/health` or similar endpoints for 200 OK responses.
  - Use Postman or `curl` to verify key API endpoints.
- **Error Monitoring:**
  - Check server logs for errors or warnings.
  - Monitor error reporting tools if configured.

---

## Rollback Procedures

- **Revert to Previous Version:**
  1. Identify the last stable commit hash: `git log`
  2. Checkout the previous commit: `git checkout <commit-hash>`
  3. Rebuild and restart services:
     ```bash
     npm run build:all
     npm run pm2:start
     ```
- **Emergency Rollback:**
  - Restore MongoDB backup if data corruption occurred:
    ```bash
    mongorestore ~/mongo_backups/<backup-folder>
    ```
  - If build artifacts are broken, restore from backup or re-deploy last known good build.
- **Data Recovery:**
  - Use `mongorestore` for database recovery.
  - Restore `.env` and config files from backup if needed.

---

## Environment-specific Considerations

- **Production vs Development:**
  - Production uses `NODE_ENV=production` (see PM2 config).
  - Development uses `NODE_ENV=development`.
- **SSL Certificate Handling:**
  - Apache uses self-signed certs (`serverside/selfsigned.conf`).
  - Cert files: `/etc/ssl/selfsigned/selfsigned.crt` and `.key`.
- **Apache Proxy Configuration:**
  - Reverse proxy routes:
    - `/svelte/` → `localhost:3002`
    - `/api/` → `localhost:3003`
    - `/roomsmanagement/` → `localhost:3004`
    - `/` → `localhost:3001` (main frontend)
- **MongoDB Considerations:**
  - Ensure MongoDB is running and accessible.
  - Regularly backup data before deployments.

---

## Environment Variables

- **production/.env.example**
  - `APIKEYMETROPOLIA`, `PASSWORDMETROPOLIA`, `JWT_SECRET`, `DEV_USER`, `DEV_PASSWORD`
- **infoscreenreact/.env.example**
  - `VITE_API_KEY`, `VITE_API_URL`
- **RoomManagementFrontend/.env.example**
  - `VITE_APP_API_URL`
- **backend-api-do-not-use/.env.example**
  - `FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_STORAGE_BUCKET`, `APIKEYMETROPOLIA`

> **Note:** Copy `.env.example` to `.env` and fill in actual values for each service before deployment.

---

## Troubleshooting

- **Build Fails:**
  - Check for missing dependencies: `npm install`
  - Review build logs for errors.
- **PM2 Process Not Starting:**
  - Check `production/ecosystem.config.cjs` for config errors.
  - Ensure ports 3001-3007 are free.
- **Frontend Not Loading:**
  - Check Apache proxy config and SSL certs.
  - Verify frontend build output exists.
- **API Not Responding:**
  - Check MongoDB connection and credentials.
  - Review API logs for stack traces.
- **Environment Variables Missing:**
  - Ensure `.env` files exist and are correctly populated.

---

## Contact Information

- **Primary Maintainer:** [Add Name & Email Here]
- **Backup Contact:** [Add Name & Email Here]
- **Escalation:** [Add escalation procedure or Slack channel]

---

> **Keep this document up to date with every major deployment or infrastructure change.**
