import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/db/mongodb';
import { CommunityProject } from '@/lib/models/content/CommunityProject';
import { User } from '@/models/auth';

// Validation schema for community project
const projectSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  stars: z.string(),
  forks: z.string(),
  contributors: z.string(),
  tags: z.array(z.string()),
  github: z.string().url(),
  website: z.string().url().optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  language: z.string().min(1),
  goodFirstIssues: z.number().int().min(0),
});

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check if user is admin
    const user = await User.findOne({ email: session.user.email });
    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validatedData = projectSchema.parse(body);

    const project = await CommunityProject.create({
      ...validatedData,
      createdBy: user._id,
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error creating community project:', error);
    if (error instanceof z.ZodError) {
      return new NextResponse('Invalid request data', { status: 400 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const projects = await CommunityProject.find()
      .sort({ createdAt: -1 });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching community projects:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
