import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { BaseDocument } from '../types';
import { withTimestamps } from '../plugins/baseSchema';

export interface IVerificationToken extends BaseDocument {
  token: string;
  userId: string;
  type: 'email-verification' | 'password-reset';
  expires: Date;
}

const verificationTokenSchema = new Schema<IVerificationToken>({
  token: { 
    type: String, 
    required: true,
    unique: true,
    index: true
  },
  userId: { 
    type: String, 
    required: true,
    index: true,
    ref: 'User'  // Reference to User model
  },
  type: { 
    type: String, 
    required: true,
    enum: ['email-verification', 'password-reset'],
    index: true
  },
  expires: { 
    type: Date, 
    required: true,
    index: true
  }
}, {
  collection: 'VerificationToken' // Explicitly set collection name
});

// Add compound indexes for common queries
verificationTokenSchema.index({ userId: 1, type: 1 });
verificationTokenSchema.index({ token: 1, type: 1 });
verificationTokenSchema.index({ expires: 1 }, { expireAfterSeconds: 0 }); // TTL index

// Methods
verificationTokenSchema.methods.isExpired = function(): boolean {
  return new Date() > this.expires;
};

verificationTokenSchema.methods.isValid = function(): boolean {
  return !this.isExpired();
};

// Statics
verificationTokenSchema.statics.findValidToken = async function(
  token: string, 
  type: 'email-verification' | 'password-reset'
): Promise<IVerificationToken | null> {
  return this.findOne({
    token,
    type,
    expires: { $gt: new Date() }
  });
};

verificationTokenSchema.statics.cleanupExpiredTokens = async function(): Promise<void> {
  await this.deleteMany({
    expires: { $lt: new Date() }
  });
};

// Apply plugins
verificationTokenSchema.plugin(withTimestamps);

const VerificationToken = mongoose.models.VerificationToken || 
  mongoose.model<IVerificationToken>('VerificationToken', verificationTokenSchema);

export { VerificationToken };
