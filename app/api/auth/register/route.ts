import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/auth/User';
import { connectToDatabase } from '@/lib/db/mongodb';
import { generateVerificationToken } from '@/lib/auth/tokens';
import { sendVerificationEmail } from '@/lib/email/sender';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const { name, email, password } = body;

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const currentTime = new Date();
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      emailVerified: null,
      isVerified: false,
      verifiedAt: null,
      lastSignedIn: null,
      isAdmin: false,
      accounts: [],
      sessions: [],
      createdAt: currentTime,
      updatedAt: currentTime
    });

    // Generate verification token
    const verificationToken = await generateVerificationToken(user._id.toString());

    // Send verification email
    try {
      await sendVerificationEmail({
        email: user.email,
        token: verificationToken.token,
        name: user.name
      });
    } catch (error) {
      return NextResponse.json(
        { 
          error: 'Account created but failed to send verification email. Please use the resend verification option.',
          code: 'verification_email_failed',
          userId: user._id.toString(),
          redirect: '/auth/verify-status'
        },
        { status: 201 }  // Created, but with warning
      );
    }

    return NextResponse.json({ 
      message: 'Registration successful. Please check your email to verify your account.',
      userId: user._id.toString(),
      redirect: '/auth/verify-status'
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
