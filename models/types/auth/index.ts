import { BaseDocument } from '../types';

export interface Account {
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
}

export interface Session {
  sessionToken: string;
  userId: string;
  expires: Date;
}

export interface WithVerification {
  emailVerified: Date | null;
  isVerified: boolean;
  verifiedAt: Date | null;
}

export interface WithRole {
  role: 'user' | 'admin';
}

export interface WithAuth extends WithVerification, WithRole {
  email: string;
  password?: string;
  accounts?: Account[];
  sessions?: Session[];
}
