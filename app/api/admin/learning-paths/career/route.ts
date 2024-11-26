import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db/mongodb';
import { CareerPath } from '@/models/CareerPath';

const careerPathSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  icon: z.string().min(1, 'Icon is required'),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const careerPaths = await CareerPath.find().sort({ createdAt: -1 });

    return NextResponse.json(careerPaths);
  } catch (error) {
    console.error('Error fetching career paths:', error);
    return NextResponse.json(
      { error: 'Failed to fetch career paths' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = careerPathSchema.parse(body);

    await connectToDatabase();
    const careerPath = new CareerPath(validatedData);
    await careerPath.save();

    return NextResponse.json(careerPath, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating career path:', error);
    return NextResponse.json(
      { error: 'Failed to create career path' },
      { status: 500 }
    );
  }
}
