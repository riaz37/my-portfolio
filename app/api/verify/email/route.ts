import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/models/auth/User';
import { VerificationToken } from '@/models/auth/VerificationToken';
import { signIn } from 'next-auth/react';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(
        new URL('/auth/verify-status?error=No token provided', request.url)
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
        new URL('/auth/verify-status?error=Invalid token', request.url)
      );
    }

    // Check if token is expired
    if (verificationToken.isExpired()) {
      await VerificationToken.deleteOne({ _id: verificationToken._id });
      return NextResponse.redirect(
        new URL('/auth/verify-status?error=Token has expired', request.url)
      );
    }

    const now = new Date();

    // Find and update user
    const user = await User.findOneAndUpdate(
      { 
        _id: verificationToken.userId,
        emailVerified: null // Only update if not already verified
      },
      { 
        emailVerified: now,
        isVerified: true,
        verifiedAt: now
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.redirect(
        new URL('/auth/verify-status?error=User not found or already verified', request.url)
      );
    }

    // Delete the verification token
    await VerificationToken.deleteOne({ _id: verificationToken._id });

    // Redirect to verify-status page with success state and auto-login flag
    const redirectUrl = new URL('/auth/verify-status', request.url);
    redirectUrl.searchParams.set('success', 'true');
    redirectUrl.searchParams.set('message', 'Email verified successfully!');
    redirectUrl.searchParams.set('email', user.email);
    redirectUrl.searchParams.set('autoLogin', 'true');
    redirectUrl.searchParams.set('userId', user._id.toString());
    
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Error verifying email:', error);
    return NextResponse.redirect(
      new URL('/auth/verify-status?error=Verification failed', request.url)
    );
  }
}
