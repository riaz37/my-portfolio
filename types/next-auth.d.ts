import NextAuth, { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      isAdmin: boolean;
      isVerified: boolean;
      emailVerified: Date | null;
      role: string;
      lastSignedIn: Date | null;
      verifiedAt: Date | null;
      _id: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    email: string;
    name: string;
    image?: string;
    isAdmin: boolean;
    isVerified: boolean;
    emailVerified: Date | null;
    role: string;
    lastSignedIn: Date | null;
    verifiedAt: Date | null;
    _id: string;
  }

  interface JWT {
    id: string;
    email: string;
    name: string;
    isAdmin: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    name: string;
    image?: string;
    isAdmin: boolean;
    isVerified: boolean;
    emailVerified: Date | null;
    role: string;
    lastSignedIn: Date | null;
    verifiedAt: Date | null;
    _id: string;
  }
}
