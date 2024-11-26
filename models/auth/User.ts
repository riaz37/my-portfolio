import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { BaseDocument } from '../types';
import { WithAuth } from '../types/auth';
import { withTimestamps } from '../plugins/baseSchema';
import { withAuth, withVerification, withRole } from '../plugins/authSchema';

export interface IUser extends BaseDocument, WithAuth {
  name: string;
  email: string;
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
  emailVerified: { 
    type: Date,
    default: null 
  },
  verifiedAt: { 
    type: Date,
    default: null 
  },
  isVerified: { 
    type: Boolean,
    default: false 
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
    session_state: String,
  }],
  sessions: [{
    sessionToken: String,
    userId: String,
    expires: Date,
  }],
});

// Methods
userSchema.methods.isAdmin = function(): boolean {
  return this.role === 'admin';
};

userSchema.methods.isEmailVerified = function(): boolean {
  return this.isVerified && this.emailVerified !== null;
};

// Virtual for full name
userSchema.virtual('displayName').get(function() {
  return this.name || this.email.split('@')[0];
});

// Add index for account lookups
userSchema.index({ 'accounts.provider': 1, 'accounts.providerAccountId': 1 });
// Add index for session lookups
userSchema.index({ 'sessions.sessionToken': 1 });

// Apply plugins
userSchema.plugin(withTimestamps);
userSchema.plugin(withAuth);
userSchema.plugin(withVerification);
userSchema.plugin(withRole);

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export default User;
