import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/models/auth/User';
import { VerificationToken } from '@/models/auth/VerificationToken';

export async function GET(request: Request) {
  try {
    console.log('Starting email verification process...');
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      console.log('No token provided');
      return NextResponse.redirect(
        new URL('/auth/verify-error?error=Verification token is required', request.url)
      );
    }

    console.log('Connecting to database...');
    await connectToDatabase();

    // Find the verification token
    console.log('Finding verification token...');
    const verificationToken = await VerificationToken.findOne({
      token,
      type: 'email-verification',
      expires: { $gt: new Date() }
    });

    if (!verificationToken) {
      console.log('Invalid or expired token');
      return NextResponse.redirect(
        new URL('/auth/verify-error?error=Invalid or expired verification token', request.url)
      );
    }

    // Find and update the user
    console.log('Finding and updating user...');
    const user = await User.findByIdAndUpdate(
      verificationToken.userId,
      {
        emailVerified: new Date(),
        isVerified: true,
        verifiedAt: new Date()
      },
      { new: true }
    );

    if (!user) {
      console.log('User not found');
      return NextResponse.redirect(
        new URL('/auth/verify-error?error=User not found', request.url)
      );
    }

    // Delete the used token
    console.log('Deleting used token...');
    await VerificationToken.deleteOne({ _id: verificationToken._id });

    console.log('Email verification successful');
    return NextResponse.redirect(
      new URL('/auth/verify-success?redirect=/playground', request.url)
    );
  } catch (error: any) {
    console.error('Error in email verification:', {
      error: error.message,
      stack: error.stack,
      name: error.name
    });
    return NextResponse.redirect(
      new URL('/auth/verify-error?error=An error occurred during verification', request.url)
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

    return GET(request);
  } catch (error) {
    console.error('Error parsing request body:', error);
    return NextResponse.redirect(
      new URL('/auth/verify-error?error=Invalid request', request.url)
    );
  }
}
