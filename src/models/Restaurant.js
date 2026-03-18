import mongoose from 'mongoose';

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  
  // NEW: The approval status with strict allowed values
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  },
  
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Restaurant || mongoose.model('Restaurant', RestaurantSchema);