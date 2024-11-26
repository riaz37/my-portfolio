import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/models/auth/User';
import { generateVerificationToken } from '@/lib/auth/tokens';
import { sendVerificationEmail } from '@/lib/email/sender';

export async function POST(request: Request) {
  try {
    console.log('Starting resend verification process...');
    const { email } = await request.json();

    if (!email) {
      console.log('No email provided');
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    console.log('Connecting to database...');
    await connectToDatabase();

    // Find user
    console.log('Finding user...');
    const user = await User.findOne({ email });

    if (!user) {
      console.log('User not found');
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      console.log('User already verified');
      return NextResponse.json(
        { error: 'Email is already verified' },
        { status: 400 }
      );
    }

    // Generate new token
    console.log('Generating verification token...');
    const verificationToken = await generateVerificationToken(user._id);

    // Send verification email
    console.log('Sending verification email...');
    await sendVerificationEmail({
      email: user.email,
      token: verificationToken.token,
      name: user.name
    });

    console.log('Verification email sent successfully');
    return NextResponse.json(
      { message: 'Verification email sent' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error in resend verification:', {
      error: error.message,
      stack: error.stack,
      name: error.name
    });
    return NextResponse.json(
      { 
        error: 'Failed to send verification email',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
