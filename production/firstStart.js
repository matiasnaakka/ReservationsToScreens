
import { connectMongo } from './utils/mongo.js';
import Room from './models/Room.js';
import BusinessHours from './models/BusinessHours.js';
import fs from 'fs';
import path from 'path';

const dataDir = path.resolve('./data');

async function importRooms() {
  const roomsPath = path.join(dataDir, 'rooms.json');
  const roomsRaw = fs.readFileSync(roomsPath, 'utf-8');
  const rooms = JSON.parse(roomsRaw);
  // Only insert rooms with a roomNumber (skip trailing test/empty objects)

  await Room.deleteMany({});
  await Room.insertMany(rooms);
  console.log(`Imported ${rooms.length} rooms.`);
}

async function importBusinessHours() {
  const bhPath = path.join(dataDir, 'businesshours.json');
  const bhRaw = fs.readFileSync(bhPath, 'utf-8');
  const businessHours = JSON.parse(bhRaw);
  await BusinessHours.deleteMany({});
  await BusinessHours.create(businessHours);
  console.log('Imported business hours.');
}

async function main() {
  await connectMongo();
  await importRooms();
  await importBusinessHours();
  process.exit(0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
