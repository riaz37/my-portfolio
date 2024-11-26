import { NextAuthOptions } from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectToDatabase, getMongoDb } from "@/lib/db/mongodb";
import User from "@/models/auth/User";

const clientPromise = connectToDatabase();

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(getMongoDb()),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const db = await clientPromise;
        const user = await User.findOne({ email: credentials.email }).select('+password');

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }

        const isFirstSignIn = !user.lastSignedIn;
        const isVerified = user.isVerified || user.emailVerified;

        if (!isVerified && !isFirstSignIn) {
          throw new Error("Please verify your email before signing in");
        }

        try {
          await User.findByIdAndUpdate(user._id, {
            lastSignedIn: new Date(),
            ...(isFirstSignIn && {
              isVerified: true,
              verifiedAt: new Date()
            })
          });
        } catch (error) {
          console.error('Error updating user:', error);
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
          isVerified: isVerified || isFirstSignIn,
          emailVerified: user.emailVerified,
          role: user.role
        };
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD
        }
      },
      from: process.env.EMAIL_FROM
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user?.email) {
        return false;
      }

      try {
        await connectToDatabase();

        if (account?.provider === "credentials") {
          return true;
        }

        // For OAuth providers (Google, GitHub)
        const currentTime = new Date();
        const existingUser = await User.findOne({ email: user.email });

        if (existingUser) {
          await User.findByIdAndUpdate(existingUser._id, {
            name: user.name || existingUser.name,
            image: user.image || existingUser.image,
            emailVerified: currentTime,
            isVerified: true,
            verifiedAt: currentTime,
            lastSignedIn: currentTime,
          });
          // Add verification info to user object
          user.isVerified = true;
          user.emailVerified = currentTime;
          return true;
        }

        // Create new user
        const newUser = await User.create({
          name: user.name,
          email: user.email,
          image: user.image,
          emailVerified: currentTime,
          isVerified: true,
          verifiedAt: currentTime,
          lastSignedIn: currentTime,
          role: "user",
        });
        // Add verification info to user object
        user.isVerified = true;
        user.emailVerified = currentTime;
        user.id = newUser._id.toString();
        user.role = "user";

        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture as string;
        session.user.isVerified = token.isVerified as boolean;
        session.user.role = token.role as string;
        session.user.emailVerified = token.emailVerified as Date;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isVerified = user.isVerified;
        token.emailVerified = user.emailVerified;
      }

      // Get latest user data
      if (token?.email) {
        try {
          await connectToDatabase();
          const dbUser = await User.findOne({ email: token.email });
          if (dbUser) {
            token.id = dbUser._id.toString();
            token.name = dbUser.name;
            token.email = dbUser.email;
            token.picture = dbUser.image;
            token.isVerified = dbUser.isVerified;
            token.emailVerified = dbUser.emailVerified;
            token.role = dbUser.role;
          }
        } catch (error) {
          console.error("Error in jwt callback:", error);
        }
      }

      return token;
    }
  }
};
