import mongoose from 'mongoose';

const ReservationSchema = new mongoose.Schema({
  foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem', required: true },
  foodName: { type: String, required: true },
  pickupCode: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Completed', 'Cancelled'], default: 'Pending' },
  
  // NEW: Fields for the Review & Rating feature!
  rating: { type: Number, min: 1, max: 5 },
  reviewText: { type: String },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Reservation || mongoose.model('Reservation', ReservationSchema);