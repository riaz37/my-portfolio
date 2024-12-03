import { NextAuthOptions } from "next-auth";
import { User as NextAuthUser } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/auth/User";
import { JWT } from "next-auth/jwt";
import { connectToDatabase } from "@/lib/db/mongodb";

interface User extends NextAuthUser {
  id: string;
  email: string;
  name: string;
  password?: string;
  image?: string;
  isAdmin: boolean;
  emailVerified: Date | null;
  isVerified: boolean;
  role: string;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      isAdmin: boolean;
      emailVerified: Date | null;
      isVerified: boolean;
      role: string;
    };
  }
  interface User {
    id: string;
    email: string;
    name: string;
    password?: string;
    image?: string;
    isAdmin: boolean;
    emailVerified: Date | null;
    isVerified: boolean;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    isAdmin: boolean;
    emailVerified: Date | null;
    isVerified: boolean;
    role: string;
  }
}

const createUserFromProvider = async (
  email: string,
  name: string,
  image?: string | null
): Promise<User | null> => {
  return await User.create({
    email,
    name,
    image,
    emailVerified: new Date(),
    isVerified: true, // Provider accounts are pre-verified
    role: "user",
    isAdmin: false,
    verifiedAt: new Date(),
  });
};

const updateUserFromProvider = async (
  email: string,
  name: string,
  image?: string | null
): Promise<User | null> => {
  return await User.findOneAndUpdate(
    { email },
    {
      $set: {
        name,
        image,
        emailVerified: new Date(),
        isVerified: true, // Provider accounts are pre-verified
        verifiedAt: new Date(),
      }
    },
    { new: true }
  );
};

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-status",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Please enter an email and password");
          }

          await connectToDatabase();
          
          const user = await User.findOne({ email: credentials.email }).select('+password');
          console.log('Found user:', user ? 'Yes' : 'No');
          
          if (!user) {
            throw new Error("No user found with this email");
          }

          if (!user.password) {
            console.log('No password set for user');
            throw new Error("Please login with your social provider");
          }

          const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);
          console.log('Password match:', isPasswordMatch);

          if (!isPasswordMatch) {
            throw new Error("Incorrect password");
          }

          // Return user without password
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
            isAdmin: user.isAdmin || false,
            emailVerified: user.emailVerified,
            isVerified: user.isVerified || false,
            role: user.role || 'user'
          };
        } catch (error) {
          console.error('Auth error:', error);
          throw error instanceof Error ? error : new Error("Authentication failed");
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        token.isAdmin = user.isAdmin;
        token.emailVerified = user.emailVerified;
        token.isVerified = user.isVerified;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.image as string;
        session.user.isAdmin = token.isAdmin;
        session.user.emailVerified = token.emailVerified;
        session.user.isVerified = token.isVerified;
        session.user.role = token.role;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allow relative URLs
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      // Allow same-origin URLs
      else if (new URL(url).origin === baseUrl) {
        return url;
      }
      return baseUrl;
    },
  },
  debug: true,
};
