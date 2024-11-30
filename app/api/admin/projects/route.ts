import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/db/mongodb';
import { User } from '@/models/auth';
import Project from '@/lib/db/models/Project';
import { authOptions } from '@/lib/auth';
import { validateAdminAccess } from '@/lib/auth/admin';

// Project validation schema
const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  technologies: z.array(z.string()).optional(),
  githubLink: z.string().url().optional(),
  demoLink: z.string().url().optional(),
  order: z.number().optional(),
  isDeleted: z.boolean().optional().default(false)
});

// GET all projects (including soft-deleted)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    await validateAdminAccess(session);

    await connectToDatabase();
    
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Failed to fetch projects:', error);
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

// POST new project
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    await validateAdminAccess(session);

    await connectToDatabase();
    
    const data = await req.json();
    
    // Validate input using Zod
    const validatedData = projectSchema.parse({
      ...data,
      createdBy: session.user._id,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const project = await Project.create(validatedData);
    
    console.log(`Project created by admin ${session.user.email}:`, project._id);
    
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Failed to create project:', error);
    
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid project data', 
          details: error.errors 
        },
        { status: 400 }
      );
    }

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

// PUT update project
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    await validateAdminAccess(session);

    await connectToDatabase();
    
    const data = await req.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Validate input using Zod (excluding ID)
    const validatedData = projectSchema.partial().parse({
      ...updateData,
      updatedAt: new Date(),
      updatedBy: session.user._id
    });

    const project = await Project.findByIdAndUpdate(
      id,
      { 
        ...validatedData, 
        updatedAt: new Date(),
        updatedBy: session.user._id
      },
      { new: true }
    );

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    console.log(`Project updated by admin ${session.user.email}:`, project._id);
    
    return NextResponse.json(project);
  } catch (error) {
    console.error('Failed to update project:', error);
    
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid project update data', 
          details: error.errors 
        },
        { status: 400 }
      );
    }

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

// DELETE project (soft delete)
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    await validateAdminAccess(session);

    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Soft delete instead of hard delete
    const project = await Project.findByIdAndUpdate(
      id, 
      { 
        isDeleted: true, 
        deletedAt: new Date(),
        deletedBy: session.user._id 
      },
      { new: true }
    );

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    console.log(`Project soft-deleted by admin ${session.user.email}:`, project._id);
    
    return NextResponse.json({ 
      message: 'Project soft-deleted successfully',
      project 
    });
  } catch (error) {
    console.error('Failed to delete project:', error);
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
