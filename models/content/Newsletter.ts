import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { BaseDocument } from '../types';
import { withTimestamps } from '../plugins/baseSchema';

export interface INewsletter extends BaseDocument {
  email: string;
  isSubscribed: boolean;
  subscriptionDate: Date;
  unsubscribeToken: string;
  preferences: {
    weeklyDigest: boolean;
    newChallenges: boolean;
    productUpdates: boolean;
  };
  lastEmailSent?: Date;
  bounceCount: number;
}

const newsletterSchema = new Schema<INewsletter>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    index: true
  },
  isSubscribed: {
    type: Boolean,
    default: true,
    index: true
  },
  subscriptionDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  unsubscribeToken: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  preferences: {
    weeklyDigest: {
      type: Boolean,
      default: true
    },
    newChallenges: {
      type: Boolean,
      default: true
    },
    productUpdates: {
      type: Boolean,
      default: true
    }
  },
  lastEmailSent: {
    type: Date,
    default: null
  },
  bounceCount: {
    type: Number,
    default: 0,
    min: 0
  }
});

// Apply plugins
withTimestamps(newsletterSchema);

// Add compound indexes
newsletterSchema.index({ isSubscribed: 1, lastEmailSent: 1 });
newsletterSchema.index({ email: 1, unsubscribeToken: 1 });

// Methods
newsletterSchema.methods.unsubscribe = async function(): Promise<void> {
  this.isSubscribed = false;
  await this.save();
};

newsletterSchema.methods.updatePreferences = async function(
  preferences: Partial<INewsletter['preferences']>
): Promise<void> {
  this.preferences = { ...this.preferences, ...preferences };
  await this.save();
};

newsletterSchema.methods.recordEmailSent = async function(): Promise<void> {
  this.lastEmailSent = new Date();
  await this.save();
};

newsletterSchema.methods.recordBounce = async function(): Promise<void> {
  this.bounceCount += 1;
  if (this.bounceCount >= 3) {
    this.isSubscribed = false;
  }
  await this.save();
};

// Pre-save hooks
newsletterSchema.pre('save', function(next) {
  if (this.isNew && !this.unsubscribeToken) {
    this.unsubscribeToken = mongoose.Types.ObjectId().toString();
  }
  next();
});

// Statics
newsletterSchema.statics.findActiveSubscribers = async function(
  preferences?: keyof INewsletter['preferences']
): Promise<INewsletter[]> {
  const query: any = { isSubscribed: true };
  if (preferences) {
    query[`preferences.${preferences}`] = true;
  }
  return this.find(query);
};

newsletterSchema.statics.findByUnsubscribeToken = async function(
  token: string
): Promise<INewsletter | null> {
  return this.findOne({ unsubscribeToken: token });
};

export const Newsletter = mongoose.models.Newsletter || 
  mongoose.model<INewsletter>('Newsletter', newsletterSchema);
