import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/models/auth/User';
import { CommunityProject } from '@/lib/models/content/CommunityProject';


// Validation schema for project update
const projectUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  stars: z.string().optional(),
  forks: z.string().optional(),
  contributors: z.string().optional(),
  tags: z.array(z.string()).optional(),
  github: z.string().url().optional(),
  website: z.string().url().optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  language: z.string().min(1).optional(),
  goodFirstIssues: z.number().int().min(0).optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check if user is admin
    const user = await User.findOne({ email: session.user.email });
    if (!user?.isAdmin) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const validatedData = projectUpdateSchema.parse(body);

    const project = await CommunityProject.findByIdAndUpdate(
      params.id,
      { $set: validatedData },
      { new: true }
    );

    if (!project) {
      return new NextResponse('Project not found', { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    if (error instanceof z.ZodError) {
      return new NextResponse('Invalid request data', { status: 400 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check if user is admin
    const user = await User.findOne({ email: session.user.email });
    if (!user?.isAdmin) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const project = await CommunityProject.findByIdAndDelete(params.id);
    if (!project) {
      return new NextResponse('Project not found', { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting project:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
