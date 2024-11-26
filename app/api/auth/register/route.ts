import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/auth/User';
import { connectToDatabase } from '@/lib/db/mongodb';
import { generateVerificationToken } from '@/lib/auth/tokens';
import { sendVerificationEmail } from '@/lib/email/sender';

export async function POST(request: NextRequest) {
  try {
    console.log('Registration request received');
    
    await connectToDatabase();
    
    const body = await request.json();
    const { name, email, password } = body;

    // Debug logging
    console.log('Registration attempt:', { 
      hasName: !!name, 
      hasEmail: !!email, 
      hasPassword: !!password,
      nameType: typeof name,
      emailType: typeof email,
      name,
      email 
    });

    // Validate input
    if (!name || !email || !password) {
      console.log('Missing required fields:', {
        name: !name,
        email: !email,
        password: !password
      });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format:', email);
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      console.log('Password too short');
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      emailVerified: null,
      isVerified: false,
      verifiedAt: null,
      role: 'user',
    });

    console.log('User created successfully:', user._id);

    // Generate verification token
    const verificationToken = await generateVerificationToken(user._id.toString());

    // Send verification email
    try {
      console.log('Attempting to send verification email...');
      await sendVerificationEmail({
        email: user.email,
        token: verificationToken.token,
        name: user.name
      });
      console.log('Verification email sent successfully');
    } catch (error) {
      console.error('Failed to send verification email:', error);
      // Don't fail registration if email fails
      return NextResponse.json(
        { 
          error: 'Account created but failed to send verification email. Please use the resend verification option.',
          code: 'verification_email_failed',
          userId: user._id.toString()
        },
        { status: 201 }  // Created, but with warning
      );
    }

    // Create initial user skills
    const initialSkills = [
      'Data Structures',
      'Algorithms',
      'Problem Solving',
      'Logic',
      'Mathematics',
    ].map(skillName => ({
      userId: user._id,
      skillName,
      level: 1,
      xp: 0,
      gamesCompleted: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await User.updateOne({ _id: user._id }, { $push: { skills: { $each: initialSkills } } });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toObject();

    return NextResponse.json(
      { 
        message: 'Registration successful! Please check your email to verify your account.',
        user: userWithoutPassword
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to register user',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
