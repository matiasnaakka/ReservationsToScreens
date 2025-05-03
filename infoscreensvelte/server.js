import express from 'express';
import cors from 'cors';
import {fileURLToPath} from 'url';
import {dirname, join} from 'path';
import {promises as fs} from 'fs';
import readline from 'readline';
import coordsApi from './api/coordsApi.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;
const STORE_PATH = join(__dirname, './src/stores/wallsStore.ts');

// Middleware
app.use(
  cors({
    origin: 'http://localhost:3030', // Frontend URL
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type']
  })
);
app.use(express.json());

// API Routes
app.use('/api/coords', coordsApi);

// Static files
app.use(express.static(join(__dirname, 'public')));

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({error: 'Something broke!'});
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// ...existing code for wall coordination functionality...
