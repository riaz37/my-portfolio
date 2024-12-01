import type { AuthOptions, Session as AuthSession, User as AuthUser } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';

declare module 'next-auth' {
  interface User {
    id?: string;
    _id?: string;
    isVerified?: boolean;
    emailVerified?: Date | null;
    isAdmin: boolean;
  }

  interface Session {
    user: User & {
      id: string;
      isVerified: boolean;
      emailVerified: Date | null;
      isAdmin: boolean;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    isVerified: boolean;
    emailVerified: Date | null;
    isAdmin: boolean;
  }
}

import { connectToDatabase } from "@/lib/db/mongodb";
import User from "@/models/auth/User";

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("Missing NEXTAUTH_SECRET environment variable");
}

// MongoDB helper functions
export async function getUserByEmail(email: string) {
  await connectToDatabase();
  return User.findOne({ email }).select("+password");
}

export async function getUserById(id: string) {
  await connectToDatabase();
  return User.findById(id);
}

export async function createUser({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  await connectToDatabase();
  const hashedPassword = await bcrypt.hash(password, 12);
  const now = new Date();

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    isAdmin: false,
    emailVerified: null,
    isVerified: false,
    verifiedAt: null,
    createdAt: now,
    updatedAt: now,
  });

  return user;
}

export async function updateUserPassword(userId: string, newPassword: string) {
  await connectToDatabase();
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  return User.findByIdAndUpdate(
    userId,
    {
      password: hashedPassword,
      updatedAt: new Date(),
    },
    { new: true }
  );
}

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      async profile(profile) {
        await connectToDatabase();

        // Find or create user
        let user = await User.findOne({ email: profile.email });

        if (!user) {
          const currentTime = new Date();
          user = await User.create({
            name: profile.name,
            email: profile.email,
            emailVerified: currentTime,
            isVerified: true,
            verifiedAt: currentTime,
            lastSignedIn: currentTime,
            isAdmin: false,
            accounts: [],
            sessions: [],
            createdAt: currentTime,
            updatedAt: currentTime
          });
        } else {
          // Update lastSignedIn
          await User.updateOne(
            { _id: user._id },
            { 
              $set: { lastSignedIn: new Date() },
              $currentDate: { updatedAt: true }
            }
          );
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin,
          isVerified: user.isVerified,
          emailVerified: user.emailVerified,
        };
      },
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await getUserByEmail(credentials.email);
        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        // Update lastSignedIn
        await User.updateOne(
          { _id: user._id },
          { 
            $set: { lastSignedIn: new Date() },
            $currentDate: { updatedAt: true }
          }
        );

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin,
          isVerified: user.isVerified,
          emailVerified: user.emailVerified,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin;
        token.isVerified = user.isVerified;
        token.emailVerified = user.emailVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.isAdmin = token.isAdmin;
        session.user.isVerified = token.isVerified;
        session.user.emailVerified = token.emailVerified;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
