import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { connectDB } from '@/lib/db/mongodb';

export async function POST(request: Request) {
  try {
    const { email, password, adminKey } = await request.json();

    // Verify admin creation key
    if (adminKey !== process.env.ADMIN_CREATION_KEY) {
      return NextResponse.json(
        { error: 'Invalid admin creation key' },
        { status: 401 }
      );
    }

    const { db } = await connectDB();

    // Check if admin already exists
    const existingAdmin = await db.collection('users').findOne({
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
    const result = await db.collection('users').insertOne({
      email,
      password: hashedPassword,
      role: 'admin',
      name: 'Admin',
      emailVerified: new Date(),
      isVerified: true,
      verifiedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json({
      message: 'Admin user created successfully',
      userId: result.insertedId
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json(
      { error: 'Failed to create admin user' },
      { status: 500 }
    );
  }
}
