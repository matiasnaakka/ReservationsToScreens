import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import logger from './utils/logger.js';
import jwt from 'jsonwebtoken';

import rootRoute from './routes/root.js';
import protectedRoute from './routes/protected.js';
import reservationsRoute from './routes/reservations.js';
import roomsRoute from './routes/rooms.js';
import businesshoursRoute from './routes/businesshours.js';
import karamalmiRoute from './routes/karamalmi.js';
import { connectMongo } from './utils/mongo.js';
import authMiddleware from './middleware/auth.js'; // <--- tärkeä!

// Setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Add login endpoint
/**
 * POST /api/login
 * Authenticates user against Metropolia Streams API or .env dev credentials and returns JWT on success.
 */
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const devUser = process.env.DEV_USER;
  const devPassword = process.env.DEV_PASSWORD;

  // Allow login with .env dev credentials
  if (
    devUser &&
    devPassword &&
    username === devUser &&
    password === devPassword
  ) {
    const token = jwt.sign(
      { username: devUser, staff: false, dev: true },
      process.env.JWT_SECRET || 'default_jwt_secret',
      { expiresIn: '2h' }
    );
    return res.json({ token });
  }

  try {
    const response = await fetch('https://streams.metropolia.fi/2.0/api/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();

    if ( data.message === 'invalid username or password' ) {
      logger.warn('Invalid login attempt', { username });
      return res.status(401).json({ message: 'Invalid username or password.' });
    }
    if (data.staff === false) {
      logger.warn('Non staff login attempt', { username });
      return res.status(403).json({ message: 'non staff accounts are not allowed to login.' });
    }
    if ( data.user && data.staff === true ) {
      logger.info('User logged in successfully', { username: data.user });
      const token = jwt.sign(
        { username: data.user, staff: data.staff },
        process.env.JWT_SECRET || 'default_jwt_secret',
        { expiresIn: '2h' }
      );
      return res.json({ token });
    }
    return res.status(500).json({ message: 'Unexpected response from authentication service.' });
  } catch (err) {
    logger.error('Login error', { error: err.message });
    return res.status(500).json({ message: `Login failed: ${err.message}` });
  }
});

/**
 * POST /api/token/validate
 * Checks if a JWT token is valid and not expired.
 */
app.post('/api/token/validate', (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ valid: false, message: 'Token is required.' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_jwt_secret');
    return res.json({ valid: true, decoded });
  } catch (err) {
    return res.status(401).json({ valid: false, message: 'Invalid or expired token.' });
  }
});

// Mongo yhteys ja reitit
connectMongo().then(() => {
  const apiKey = process.env.PASSWORDMETROPOLIA;

  // TÄRKEÄ: Suojataan kaikki muut /api-reitit apikeyllä
  app.use('/api', authMiddleware(apiKey));

  // Muut reitit
  app.use('/', rootRoute);
  app.use(protectedRoute(apiKey));
  app.use(reservationsRoute(apiKey));
  app.use(roomsRoute(apiKey));
  app.use(businesshoursRoute(apiKey));
  app.use(karamalmiRoute(apiKey));

  console.log('Loaded API key:', apiKey);

  // Start server
  const PORT = process.env.PORT || 3003;
  app.listen(PORT, () => {
    logger.info('Server started', {
      port: PORT,
      environment: process.env.NODE_ENV,
    });
  });
});
