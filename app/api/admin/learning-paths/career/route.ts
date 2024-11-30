import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db/mongodb';
import { User } from '@/models/auth';
import { CareerPath } from '@/models/CareerPath';
import { validateAdminAccess } from '@/lib/auth/admin';

const careerPathSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  icon: z.string().min(1, 'Icon is required'),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    await validateAdminAccess(session);

    await connectToDatabase();
    
    const careerPaths = await CareerPath.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email');

    return NextResponse.json(careerPaths);
  } catch (error) {
    console.error('Error fetching career paths:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes('Unauthorized') ? 401 : 500 }
      );
    }
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized: User not authenticated' }, 
        { status: 401 }
      );
    }

    await validateAdminAccess(session);

    const body = await request.json();
    const validatedData = careerPathSchema.parse(body);

    await connectToDatabase();
    
    const user = await User.findOne({ email: session.user.email });
    const careerPath = await CareerPath.create({
      ...validatedData,
      createdBy: user._id,
    });

    return NextResponse.json(careerPath);
  } catch (error) {
    console.error('Error creating career path:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation Error', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}
