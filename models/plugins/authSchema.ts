import { Schema, Document } from 'mongoose';
import { DefaultSession } from 'next-auth';

export interface WithVerification extends Document {
  emailVerified?: Date | null;
  isVerified: boolean;
  verifiedAt?: Date | null;
}

export interface WithRole extends Document {
  role: 'user' | 'admin';
}

export interface WithAuth extends WithVerification, WithRole, DefaultSession {
  email: string;
  password?: string;
}

export function withVerification<T extends WithVerification>(schema: Schema<T>) {
  schema.add({
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
    }
  });

  schema.pre('save', function(next) {
    if (this.isModified('isVerified') && this.isVerified && !this.verifiedAt) {
      this.verifiedAt = new Date();
    }
    next();
  });
}

export function withRole<T extends WithRole>(schema: Schema<T>) {
  schema.add({
    role: { 
      type: String, 
      enum: ['user', 'admin'],
      default: 'user',
      index: true
    }
  });
}

export function withAuth<T extends WithAuth>(schema: Schema<T>) {
  schema.add({
    email: { 
      type: String, 
      required: true,
      unique: true,
      index: true
    },
    password: { 
      type: String,
      select: false  // Don't include password in queries by default
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
    }]
  });

  // Add index for account lookups
  schema.index({ 'accounts.provider': 1, 'accounts.providerAccountId': 1 });
  
  // Add index for session lookups
  schema.index({ 'sessions.sessionToken': 1 });
}
