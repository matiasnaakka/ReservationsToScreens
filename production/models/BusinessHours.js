import mongoose from '../utils/mongo.js';

const DayHoursSchema = new mongoose.Schema({
  hours: { type: Number, default: null },
  minutes: { type: Number, default: null },
  closeHours: { type: Number, default: null },
  closeMinutes: { type: Number, default: null },
  isClosed: { type: Boolean, default: false },
}, { _id: false });

const CampusSchema = new mongoose.Schema({
  name: String,
  shorthand: String,
  ImageUrl: String,
  hours: {
    monday: DayHoursSchema,
    tuesday: DayHoursSchema,
    wednesday: DayHoursSchema,
    thursday: DayHoursSchema,
    friday: DayHoursSchema,
    saturday: DayHoursSchema,
    sunday: DayHoursSchema,
  },
}, { _id: false });

const BusinessHoursSchema = new mongoose.Schema({
  campuses: [CampusSchema],
});

export default mongoose.model('BusinessHours', BusinessHoursSchema);
