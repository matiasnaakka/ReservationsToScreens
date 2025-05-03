import mongoose from '../utils/mongo.js';

const ReservationSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  // Add other fields as needed
});

export default mongoose.model('Reservation', ReservationSchema);
