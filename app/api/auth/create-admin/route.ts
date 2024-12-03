import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/models/auth/User';

const ADMIN_SECRET = process.env.ADMIN_CREATION_KEY;

export async function POST(request: Request) {
    try {
        console.log('Attempting to connect to database...');
        await connectToDatabase();
        console.log('Database connection successful');
        
        const { email, password, secretKey } = await request.json();
        console.log('Received create admin request for email:', email);

        // Verify admin creation secret
        if (!ADMIN_SECRET || secretKey !== ADMIN_SECRET) {
            console.log('Invalid admin creation key provided');
            return NextResponse.json({ 
                error: 'Unauthorized: Invalid admin creation key' 
            }, { status: 401 });
        }

        console.log('Admin creation key verified, checking for existing user...');
        // Check if admin exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            // If user exists but is not admin, update to admin
            if (!existingUser.isAdmin) {
                const updatedUser = await User.findByIdAndUpdate(
                    existingUser._id,
                    {
                        $set: {
                            isAdmin: true,
                            isVerified: true,
                            emailVerified: new Date(),
                            verifiedAt: new Date(),
                            lastSignedIn: new Date()
                        }
                    },
                    { new: true }
                );
                return NextResponse.json({ 
                    message: 'User updated to admin successfully',
                    userId: updatedUser._id 
                });
            }
            return NextResponse.json({ error: 'Admin user already exists' }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await hash(password, 12);

        // Create admin user
        const currentTime = new Date();
        const adminUser = await User.create({
            email,
            password: hashedPassword,
            isAdmin: true,
            name: 'Admin',
            role: 'admin',
            emailVerified: currentTime,
            isVerified: true,
            verifiedAt: currentTime,
            lastSignedIn: currentTime,
            accounts: [],
            sessions: [],
            createdAt: currentTime,
            updatedAt: currentTime
        });

        // Verify the admin was created with isAdmin true
        const createdAdmin = await User.findById(adminUser._id);
        if (!createdAdmin?.isAdmin) {
            await User.findByIdAndUpdate(adminUser._id, { isAdmin: true });
        }

        return NextResponse.json({ 
            message: 'Admin created successfully',
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
