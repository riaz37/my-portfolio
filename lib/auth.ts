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
  isVerified: boolean;
  emailVerified: Date | null;
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
      isVerified: boolean;
      emailVerified: Date | null;
      role: string;
    };
    id: string;
    email: string;
    name: string;
    image?: string;
    isAdmin: boolean;
    isVerified: boolean;
    emailVerified: Date | null;
    role: string;
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
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    isAdmin: boolean;
    isVerified: boolean;
    emailVerified: Date | null;
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
    isVerified: true,
    role: "user",
    isAdmin: false,
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
        isVerified: true,
      }
    },
    { new: true }
  );
};

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
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
          
          const user = await User.findOne({ email: credentials.email }).select("+password");
          
          if (!user) {
            throw new Error("No user found with this email");
          }

          if (!user.password) {
            throw new Error("Please login with your social provider");
          }

          const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);

          if (!isPasswordMatch) {
            throw new Error("Incorrect password");
          }

          return user as User;
        } catch (error) {
          throw error instanceof Error ? error : new Error("Authentication failed");
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          emailVerified: new Date(),
          isVerified: true,
          role: "user",
          isAdmin: false,
          verifiedAt: new Date(),
          lastSignedIn: new Date(),
          $assertPopulated: () => {},
          $clearModifiedPaths: () => {}
        };
      }
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          emailVerified: new Date(),
          isVerified: true,
          role: "user",
          isAdmin: false,
          verifiedAt: new Date(),
          lastSignedIn: new Date(),
          $assertPopulated: () => {},
          $clearModifiedPaths: () => {}
        };
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "credentials") {
        return true;
      }

      try {
        await connectToDatabase();

        const existingUser = await User.findOne({ email: user.email });

        if (existingUser) {
          const updatedUser = await updateUserFromProvider(
            user.email,
            user.name,
            user.image
          );
          return !!updatedUser;
        }

        const newUser = await createUserFromProvider(
          user.email,
          user.name,
          user.image
        );
        return !!newUser;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin ?? false;
        token.isVerified = user.isVerified ?? false;
        token.emailVerified = user.emailVerified ?? null;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id || '';
        session.user.isAdmin = token.isAdmin ?? false;
        session.user.isVerified = token.isVerified ?? false;
        session.user.emailVerified = token.emailVerified ?? null;
        session.user.role = token.role || '';
      }
      return session;
    }
  }
};
