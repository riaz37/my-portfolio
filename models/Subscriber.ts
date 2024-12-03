import mongoose, { Schema } from 'mongoose';

// Delete the model if it exists to ensure fresh schema
if (mongoose.models.Subscriber) {
  delete mongoose.models.Subscriber;
}

export interface ISubscriber {
  email: string;
  isSubscribed: boolean;
  subscribedAt: Date;
  unsubscribedAt?: Date;
}

const subscriberSchema = new Schema<ISubscriber>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  isSubscribed: {
    type: Boolean,
    default: true,
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
  unsubscribedAt: {
    type: Date,
    required: false,
  },
}, {
  strict: true,
  strictQuery: true,
  collection: 'subscribers', // Explicitly set collection name
});

// Clear any existing indexes
subscriberSchema.clearIndexes();

// Create new indexes
subscriberSchema.index({ email: 1 }, { unique: true });

const Subscriber = mongoose.models.Subscriber || mongoose.model<ISubscriber>('Subscriber', subscriberSchema);

export { Subscriber };
