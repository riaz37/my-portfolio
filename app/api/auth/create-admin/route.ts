import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { connectToDatabase } from '@/lib/db/mongodb';

const ADMIN_SECRET = process.env.ADMIN_CREATION_KEY;

export async function POST(request: Request) {
    try {
        const { db } = await connectToDatabase();
        const { email, password, secretKey } = await request.json();

        // Verify admin creation secret
        if (!ADMIN_SECRET || secretKey !== ADMIN_SECRET) {
            return NextResponse.json({ 
                error: 'Unauthorized: Invalid admin creation key' 
            }, { status: 401 });
        }

        // Check if admin exists
        const existingUser = await db.collection('users').findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
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
            message: 'Admin created successfully',
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
