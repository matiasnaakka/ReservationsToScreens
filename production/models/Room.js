import mongoose from '../utils/mongo.js';

const RoomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true },
  floor: String,
  building: String,
  wing: String,
  persons: String,
  squareMeters: String,
  details: String,
  reservableStudents: String,
  reservableStaff: String,
});

export default mongoose.model('Room', RoomSchema);
