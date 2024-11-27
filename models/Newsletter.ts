import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { BaseDocument } from './types';
import { withTimestamps } from './plugins/baseSchema';

export interface INewsletter extends BaseDocument {
  subject: string;
  content: string;
  sentAt: Date;
  sentBy: string;
  recipientCount: number;
  successCount: number;
  failureCount: number;
  isTest?: boolean;
  testEmail?: string;
}

const newsletterSchema = new Schema<INewsletter>({
  subject: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  sentAt: {
    type: Date,
    required: true,
  },
  sentBy: {
    type: String,
    required: true,
  },
  recipientCount: {
    type: Number,
    required: true,
  },
  successCount: {
    type: Number,
    required: true,
  },
  failureCount: {
    type: Number,
    required: true,
  },
  isTest: {
    type: Boolean,
    default: false,
  },
  testEmail: {
    type: String,
    required: false,
  }
});

// Add timestamps
newsletterSchema.plugin(withTimestamps);

// Remove any existing indexes
if (mongoose.models.Newsletter) {
  mongoose.models.Newsletter.collection.dropIndexes();
}

export const Newsletter = mongoose.models.Newsletter || mongoose.model<INewsletter>('Newsletter', newsletterSchema);
