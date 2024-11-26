import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Resource } from '@/models/Resource';

const resourceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  url: z.string().url('Invalid URL'),
  type: z.enum(['video', 'article', 'documentation', 'course', 'practice']),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  duration: z.string().optional(),
  tags: z.array(z.string()),
  provider: z.string().optional(),
  starterCode: z.string().optional(),
  instructions: z.string().optional(),
  language: z.string().optional(),
  solutionCode: z.string().optional(),
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
    const resources = await Resource.find({}).sort({ createdAt: -1 });
    return NextResponse.json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
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
    const validatedData = resourceSchema.parse(body);

    await connectToDatabase();
    const resource = new Resource(validatedData);
    await resource.save();

    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating resource:', error);
    return NextResponse.json(
      { error: 'Failed to create resource' },
      { status: 500 }
    );
  }
}
