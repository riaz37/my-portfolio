import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { BaseDocument } from '../types';
import { withTimestamps } from '../plugins/baseSchema';

export interface IUser extends BaseDocument {
  name: string;
  email: string;
  password?: string;
  emailVerified: Date | null;
  isVerified: boolean;
  verifiedAt: Date | null;
  lastSignedIn: Date | null;
  accounts?: {
    provider: string;
    type: string;
    providerAccountId: string;
    access_token?: string;
    expires_at?: number;
    refresh_token?: string;
    token_type?: string;
    scope?: string;
    id_token?: string;
    session_state?: string;
  }[];
  sessions?: {
    sessionToken: string;
    userId: string;
    expires: Date;
  }[];
  isAdmin: boolean;
  role: string;
}

const userSchema = new Schema<IUser>({
  name: { 
    type: String, 
    required: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  password: {
    type: String,
    required: false,
    select: false  // This is fine, we'll explicitly select it when needed
  },
  emailVerified: {
    type: Date,
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedAt: {
    type: Date,
    default: null
  },
  lastSignedIn: {
    type: Date,
    default: null
  },
  accounts: [{
    provider: String,
    type: String,
    providerAccountId: String,
    access_token: String,
    expires_at: Number,
    refresh_token: String,
    token_type: String,
    scope: String,
    id_token: String,
    session_state: String
  }],
  sessions: [{
    sessionToken: String,
    userId: String,
    expires: Date
  }],
  isAdmin: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin']
  }
});

// Virtual for display name
userSchema.virtual('displayName').get(function() {
  return this.name || this.email.split('@')[0];
});

// Pre-save middleware to handle verification
userSchema.pre('save', function(next) {
  if (this.isModified('isVerified') && this.isVerified && !this.verifiedAt) {
    this.verifiedAt = new Date();
  }
  next();
});

// Apply timestamps plugin
userSchema.plugin(withTimestamps);

// Create and export the model
const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
