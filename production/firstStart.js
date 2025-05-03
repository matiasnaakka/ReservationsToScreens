import { connectMongo } from './utils/mongo.js';
import Room from './models/Room.js';
import BusinessHours from './models/BusinessHours.js';
import fs from 'fs/promises';
import path from 'path';

const dataDir = path.resolve('./data');

// Helper function to read and parse JSON files
const readJsonFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    throw error;
  }
};

const importRooms = async () => {
  const roomsPath = path.join(dataDir, 'rooms.json');
  console.log(`Reading rooms from ${roomsPath}...`);

  try {
    const rooms = await readJsonFile(roomsPath);

    // Clear existing rooms
    await Room.deleteMany({});

    // Insert new rooms
    const result = await Room.insertMany(rooms);
    console.log(`Successfully imported ${result.length} rooms.`);
  } catch (error) {
    console.error('Failed to import rooms:', error.message);
    throw error;
  }
};

const importBusinessHours = async () => {
  const bhPath = path.join(dataDir, 'businesshours.json');
  console.log(`Reading business hours from ${bhPath}...`);

  try {
    const businessHours = await readJsonFile(bhPath);

    // Clear existing business hours
    await BusinessHours.deleteMany({});

    // Insert new business hours
    await BusinessHours.create(businessHours);
    console.log('Successfully imported business hours.');
  } catch (error) {
    console.error('Failed to import business hours:', error.message);
    throw error;
  }
};

const main = async () => {
  try {
    console.log('Starting data import process...');
    await connectMongo();

    // Run imports in parallel for efficiency
    await Promise.all([
      importRooms(),
      importBusinessHours()
    ]);

    console.log('Data import completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Data import failed:', error.message);
    process.exit(1);
  }
};

// Execute the main function and handle any uncaught errors
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
