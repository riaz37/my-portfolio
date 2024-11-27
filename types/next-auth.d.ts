import NextAuth, { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
      emailVerified: Date | null;
      isVerified: boolean;
      verifiedAt: Date | null;
      isAdmin?: boolean;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    role: string;
    emailVerified: Date | null;
    isVerified: boolean;
    verifiedAt: Date | null;
    isAdmin?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    emailVerified: Date | null;
    isVerified: boolean;
    verifiedAt: Date | null;
    isAdmin?: boolean;
  }
}
