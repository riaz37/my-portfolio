import { verifyToken } from '@/lib/auth/token';
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import User from "@/models/auth/User";


export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Verify the token
    const decoded = await verifyToken(token);
    if (!decoded || !decoded.email) {
      return NextResponse.json(
        { error: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    // Find and update user
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { 
          message: "Email already verified", 
          email: decoded.email,
          emailVerified: true,
          isVerified: true
        },
        { status: 200 }
      );
    }

    // Update user verification status
    user.emailVerified = new Date();
    user.isVerified = true;
    await user.save();

    return NextResponse.json(
      { 
        message: "Email verified successfully", 
        email: decoded.email,
        emailVerified: true,
        isVerified: true
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: "Failed to verify email" },
      { status: 500 }
    );
  }
}

// Keep POST method for backward compatibility
export async function POST(request: NextRequest) {
  return GET(request);
}
