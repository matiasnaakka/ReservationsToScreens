/**
 * @fileoverview Static file server for the infoScreenFrontend application.
 * Serves static files and handles single-page application routing.
 *
 * @module InfoScreenFrontendFileServer
 * @requires express
 * @requires http
 *
 * @security This server only serves static files from the 'infoScreenFrontend' directory
 * @performance Uses Express static file serving with proper caching headers
 */

import express from 'express';
import { createServer } from 'http';
import logger from './utils/logger.js';

/**
 * Express application instance for static file serving
 * Handles static file serving and SPA routing
 * All routes are public but limited to static files
 */
const app = express();

/**
 * HTTP server instance for the file server
 * Dedicated HTTP server for static file serving
 * Runs on a separate port from the main application
 */
const http = createServer(app);

/**
 * Port configuration for the file server
 * Dedicated port for static file serving
 * @default 3001
 */
const port = 3001;

/**
 * Server initialization timestamp
 * Records when the file server started
 */
const startTime = new Date();

/**
 * Static File Serving Configuration
 * Configures Express to serve static files from 'infoScreenFrontend' directory
 * Files are served from a dedicated directory only
 */
app.use(express.static('infoScreenFrontend'));

/**
 * SPA Fallback Route
 * Handles all unmatched routes for single-page application
 * Only serves index.html from infoScreenFrontend directory
 */
app.get('*', (_req, res) => {
  try {
    res.sendFile('index.html', { root: 'infoScreenFrontend' });
  } catch (error) {
    logger.error('Error serving index.html:', error);
    res.status(500).json('Error serving application');
  }
});

/**
 * Server Initialization
 * Starts the static file server
 * Listens on port 3001 for incoming connections
 */
http.listen(port, () => {
  logger.info(
    `infoScreenFrontend FILE SERVER started at: http://localhost:${port}/. Start time: ${startTime.toLocaleString()}`,
  );
});

// Error handling for server
http.on('error', (error) => {
  logger.error('File server error:', error);
});

export default app;
