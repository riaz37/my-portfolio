import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  subscribed: {
    type: Boolean,
    default: true,
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
  lastEmailSent: {
    type: Date,
    default: null,
  },
  preferences: {
    type: {
      updates: Boolean,
      marketing: Boolean,
    },
    default: {
      updates: true,
      marketing: true,
    },
  },
});

// Create or get the model
const Newsletter = mongoose.models.Newsletter || mongoose.model('Newsletter', newsletterSchema);

export default Newsletter;
