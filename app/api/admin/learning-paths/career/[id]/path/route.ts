import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db/mongodb';
import { CareerPath } from '@/models/CareerPath';
import { LearningResource } from '@/models/content/LearningPath';


const learningPathSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  icon: z.string().min(1, 'Icon is required'),
  estimatedTime: z.string().min(1, 'Estimated time is required'),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { error: 'Career path ID is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const careerPath = await CareerPath.findById(id).populate('learningPaths');

    if (!careerPath) {
      return NextResponse.json(
        { error: 'Career path not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(careerPath.learningPaths);
  } catch (error) {
    console.error('Error fetching learning paths:', error);
    return NextResponse.json(
      { error: 'Failed to fetch learning paths' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { error: 'Career path ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = learningPathSchema.parse(body);

    await connectToDatabase();
    
    const careerPath = await CareerPath.findById(id);
    if (!careerPath) {
      return NextResponse.json(
        { error: 'Career path not found' },
        { status: 404 }
      );
    }

    const learningPath = new LearningPath(validatedData);
    await learningPath.save();

    careerPath.learningPaths.push(learningPath._id);
    await careerPath.save();

    return NextResponse.json(learningPath, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating learning path:', error);
    return NextResponse.json(
      { error: 'Failed to create learning path' },
      { status: 500 }
    );
  }
}
