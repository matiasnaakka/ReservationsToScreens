import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import logger from './utils/logger.js';

import rootRoute from './routes/root.js';
import protectedRoute from './routes/protected.js';
import reservationsRoute from './routes/reservations.js';
import roomsRoute from './routes/rooms.js';
import businesshoursRoute from './routes/businesshours.js';
import karamalmiRoute from './routes/karamalmi.js';

// Setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();
const app = express();

// Middleware
app.use(cors({origin: '*'}));
app.use(express.json());

const apiKey = process.env.PASSWORDMETROPOLIA;

// Routes
app.use('/', rootRoute);
app.use(protectedRoute(apiKey));
app.use(reservationsRoute(apiKey));
app.use(roomsRoute(apiKey));
app.use(businesshoursRoute(apiKey));
app.use(karamalmiRoute(apiKey));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server started`, {
    port: PORT,
    environment: process.env.NODE_ENV,
  });
});
