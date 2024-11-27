import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import connectToDatabase from '@/lib/db/mongodb';
import User from '@/models/auth/User';


export async function POST(request: Request) {
  try {
    const { email, password, secretKey } = await request.json();

    // Verify admin creation key
    if (secretKey !== process.env.ADMIN_CREATION_KEY) {
      return NextResponse.json(
        { error: 'Invalid admin creation key' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      email,
      role: 'admin'
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Admin user already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create admin user
    const currentTime = new Date();
    const adminUser = await User.create({
      email,
      password: hashedPassword,
      role: 'admin',
      name: 'Admin',
      emailVerified: currentTime,
      isVerified: true,
      verifiedAt: currentTime,
      createdAt: currentTime,
      updatedAt: currentTime,
      lastSignedIn: currentTime
    });

    return NextResponse.json({
      message: 'Admin user created successfully',
      userId: adminUser._id
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json(
      { error: 'Failed to create admin user' },
      { status: 500 }
    );
  }
}