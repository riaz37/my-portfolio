import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/models/auth/User';
import { VerificationToken } from '@/models/auth/VerificationToken';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(
        new URL('/auth/verify-error?error=No token provided', request.url)
      );
    }

    await connectToDatabase();

    // Find and validate the token
    const verificationToken = await VerificationToken.findOne({
      token,
      type: 'email-verification'
    });

    if (!verificationToken) {
      return NextResponse.redirect(
        new URL('/auth/verify-error?error=Invalid token', request.url)
      );
    }

    // Check if token is expired
    if (verificationToken.isExpired()) {
      await VerificationToken.deleteOne({ _id: verificationToken._id });
      return NextResponse.redirect(
        new URL('/auth/verify-error?error=Token has expired', request.url)
      );
    }

    const now = new Date();

    // Find and update user
    const user = await User.findOneAndUpdate(
      { _id: verificationToken.userId },
      { 
        emailVerified: now,
        isVerified: true,
        verifiedAt: now
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.redirect(
        new URL('/auth/verify-error?error=User not found', request.url)
      );
    }

    // Delete the used token
    await VerificationToken.deleteOne({ _id: verificationToken._id });

    // Clean up any other expired tokens
    await VerificationToken.cleanupExpiredTokens();

    return NextResponse.redirect(
      new URL('/auth/verify-success', request.url)
    );
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.redirect(
      new URL('/auth/verify-error?error=Verification failed', request.url)
    );
  }
}

export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    
    if (!token) {
      return NextResponse.redirect(
        new URL('/auth/verify-error?error=Verification token is required', request.url)
      );
    }

    const newRequest = new Request(
      `${request.url}?token=${encodeURIComponent(token)}`,
      request
    );
    return GET(newRequest);
  } catch (error) {
    console.error('Error parsing request body:', error);
    return NextResponse.redirect(
      new URL('/auth/verify-error?error=Invalid request', request.url)
    );
  }
}
