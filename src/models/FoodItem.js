import mongoose from 'mongoose';

const FoodItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  discountedPrice: { type: Number, required: true },
  
  isVegan: { type: Boolean, default: false },
  isHalal: { type: Boolean, default: false },
  
  // Member 1's Module 2 addition
  expiryTime: { type: Date },
  
  restaurantId: { type: String },
  restaurantName: { type: String },
  restaurantAddress: { type: String },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.FoodItem || mongoose.model('FoodItem', FoodItemSchema);