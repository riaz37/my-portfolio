import { type DefaultSession, type NextAuthOptions } from 'next-auth';
import { type DefaultJWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from "@/lib/db/mongodb";
import User from "@/models/auth/User";
import { IUser } from '@/models/auth/User';
import { getBaseUrl } from '@/utils/url';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string | undefined;
      emailVerified: Date | null;
      isVerified: boolean;
      isAdmin: boolean;
      role: string;
      lastSignedIn: Date | null;
      verifiedAt: Date | null;
      _id: string;
    } & DefaultSession['user']
  }

  interface User extends IUser {}
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    email: string;
    name: string;
    emailVerified: Date | null;
    isVerified: boolean;
    isAdmin: boolean;
    role: string;
    lastSignedIn: Date | null;
    verifiedAt: Date | null;
    _id: string;
  }
}

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("Missing NEXTAUTH_SECRET environment variable");
}

// MongoDB helper functions
export async function getUserByEmail(email: string): Promise<IUser | null> {
  await connectToDatabase();
  return User.findOne({ email }).select("+password");
}

export async function getUserById(id: string): Promise<IUser | null> {
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
}): Promise<IUser> {
  await connectToDatabase();
  const hashedPassword = await bcrypt.hash(password, 12);
  const now = new Date();

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    emailVerified: null,
    isVerified: false,
    verifiedAt: null,
    lastSignedIn: now,
    isAdmin: false,
    role: 'user'
  });

  return user;
}

export async function updateUserPassword(userId: string, newPassword: string): Promise<IUser | null> {
  await connectToDatabase();
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  return User.findByIdAndUpdate(
    userId,
    { 
      password: hashedPassword,
      updatedAt: new Date()
    },
    { new: true }
  );
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await getUserByEmail(credentials.email);
        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        // Update last sign in
        await User.findByIdAndUpdate(user._id, {
          lastSignedIn: new Date()
        });

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: null,
          emailVerified: user.emailVerified,
          isVerified: user.isVerified || false,
          isAdmin: user.isAdmin || false,
          role: user.role || 'user',
          lastSignedIn: new Date(),
          verifiedAt: user.verifiedAt || null,
          _id: user._id,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    newUser: "/auth/signup"
  },
  callbacks: {
    async signIn({ user, account }) {
      const baseUrl = getBaseUrl();
      if (account?.provider === "google") {
        return `${baseUrl}/auth/verify-status?email=${encodeURIComponent(user.email || '')}`;
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.isAdmin = user.isAdmin;
        token.isVerified = user.isVerified;
        token.emailVerified = user.emailVerified;
        token.role = user.role;
        token.lastSignedIn = user.lastSignedIn;
        token.verifiedAt = user.verifiedAt;
        token._id = user._id;
      }

      // Handle session update
      if (trigger === "update" && session) {
        const updatedUser = await getUserById(token.id);
        if (updatedUser) {
          token.isVerified = updatedUser.isVerified ?? false;
          token.emailVerified = updatedUser.emailVerified ?? null;
          token.isAdmin = updatedUser.isAdmin ?? false;
          token.role = updatedUser.role ?? 'user';
          token.lastSignedIn = updatedUser.lastSignedIn ?? null;
          token.verifiedAt = updatedUser.verifiedAt ?? null;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.isAdmin = token.isAdmin ?? false;
        session.user.isVerified = token.isVerified ?? false;
        session.user.emailVerified = token.emailVerified ?? null;
        session.user.role = token.role ?? 'user';
        session.user.lastSignedIn = token.lastSignedIn ?? null;
        session.user.verifiedAt = token.verifiedAt ?? null;
        session.user._id = token._id;
      }
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      // No-op
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};
