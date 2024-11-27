import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/models/auth/User';
import { VerificationToken } from '@/models/auth/VerificationToken';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const verificationToken = await VerificationToken.findOne({ token });

    if (!verificationToken) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    const user = await User.findOneAndUpdate(
      { email: verificationToken.email },
      { emailVerified: true },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    await VerificationToken.deleteOne({ token });

    return NextResponse.json(
      { message: 'Email verified successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
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
