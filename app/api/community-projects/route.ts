
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/db/mongodb';
import { CommunityProject } from '@/lib/models/content/CommunityProject';



// Zod validation schema
const CommunityProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  githubLink: z.string().url("Must be a valid URL").optional(),
  stars: z.number().int().min(0).optional(),
  technologies: z.array(z.string()).optional(),
  isDeleted: z.boolean().optional().default(false),
});

export async function GET() {
  try {
    await connectToDatabase ();
    const projects = await CommunityProject.find({ isDeleted: false }).sort({ stars: -1 });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch community projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = CommunityProjectSchema.parse(body);

    await connectToDatabase ();

    const project = await CommunityProject.create({
      ...validatedData,
      createdBy: session.user.email,
      createdAt: new Date(),
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create community project' }, { status: 500 });
  } 
}
