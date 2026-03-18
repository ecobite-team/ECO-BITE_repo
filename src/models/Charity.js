import mongoose from 'mongoose';

const CharitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  contactEmail: { type: String, required: true },
  
  // They also get a strict status that defaults to Pending
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  },
  
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Charity || mongoose.model('Charity', CharitySchema);