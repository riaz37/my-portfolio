import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import mongoose from 'mongoose';

import { connectToDatabase } from '@/lib/db/mongodb';
import Project from '@/lib/db/models/Project';
import { authOptions } from '@/lib/auth';
import User from '@/models/auth/User';  // Use absolute import path

// Validate admin access
async function validateAdminAccess(session: any) {
  try {
    // Ensure database connection
    await connectToDatabase();

    // Check if session exists
    if (!session || !session.user) {
      console.error('No active session');
      throw new Error('No active session');
    }

    // Find user by email with explicit error handling
    const user = await User.findOne({ 
      email: session.user.email 
    }).lean();

    // Check if user exists and is admin
    if (!user) {
      console.error('User not found:', session.user.email);
      throw new Error('User not found');
    }

    if (!user.isAdmin) {
      console.error('User is not an admin:', session.user.email);
      throw new Error('User is not an admin');
    }

    return true;
  } catch (error) {
    console.error('Admin access validation error:', error);
    throw error;
  }
}

// Zod schema for project validation
const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  technologies: z.array(z.string()).min(1, 'At least one technology is required'),
  imageUrl: z.string().url('Invalid image URL'),
  githubUrl: z.string().url('Invalid GitHub URL'),
  liveUrl: z.string().url('Invalid live URL').optional(),
  featured: z.boolean().optional().default(false),
  order: z.number().optional().default(0),
  isDeleted: z.boolean().optional().default(false),
});

// GET all projects
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await validateAdminAccess(session);
    console.log('Admin access validated, connecting to database...');
    
    await connectToDatabase();
    console.log('Database connected successfully');
    
    const projects = await Project.find()
      .sort({ order: 1, createdAt: -1 })
      .select('-__v')
      .lean(); // Convert to plain objects
    console.log('Projects retrieved successfully:', projects.length);
    
    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' }, 
      { status: 500 }
    );
  }
}

// POST new project
export async function POST(req: NextRequest) {
  try {
    console.log('Starting project creation process...');

    // Check admin session
    const session = await getServerSession(authOptions);
    if (!session) {
      console.warn('Unauthorized access attempt to create project');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate admin access
    try {
      await validateAdminAccess(session);
      console.log('Admin access validated successfully');
    } catch (accessError) {
      console.error('Admin access validation failed:', accessError);
      return NextResponse.json({ 
        error: 'Access denied',
        details: accessError instanceof Error ? accessError.message : 'Unknown access error'
      }, { status: 403 });
    }

    // Connect to database
    try {
      await connectToDatabase();
      console.log('Database connection established');
    } catch (dbError) {
      console.error('Database connection failed:', dbError);
      return NextResponse.json({ 
        error: 'Database connection failed',
        details: dbError instanceof Error ? dbError.message : 'Unknown error'
      }, { status: 503 });
    }
    
    // Parse request body
    let data;
    try {
      data = await req.json();
      console.log('Received project data:', JSON.stringify(data, null, 2));
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return NextResponse.json({ 
        error: 'Invalid request body',
        details: parseError instanceof Error ? parseError.message : 'Unable to parse JSON'
      }, { status: 400 });
    }
    
    // Validate input using Zod
    let validatedData;
    try {
      validatedData = projectSchema.parse(data);
      console.log('Data validation passed');
    } catch (validationError) {
      console.error('Zod validation failed:', validationError);
      return NextResponse.json({ 
        error: 'Invalid project data', 
        details: validationError instanceof z.ZodError 
          ? validationError.errors 
          : 'Validation failed'
      }, { status: 400 });
    }

    // Create project
    try {
      const project = await Project.create(validatedData);
      console.log('Project created successfully:', project._id);
      
      // Convert to plain object before returning
      const projectObject = project.toObject();
      return NextResponse.json(projectObject, { status: 201 });
    } catch (createError) {
      console.error('Failed to create project:', createError);
      return NextResponse.json({ 
        error: 'Failed to create project',
        details: createError instanceof Error ? createError.message : 'Unknown creation error'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Unexpected error in project creation:', error);
    return NextResponse.json({ 
      error: 'An unexpected error occurred',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PUT update project
export async function PUT(req: NextRequest) {
  try {
    // Check admin session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate admin access
    await validateAdminAccess(session);

    // Parse request body
    const data = await req.json();
    
    // Extract project ID from URL
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/');
    const id = pathSegments[pathSegments.length - 1];

    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    // Validate input using Zod (excluding ID)
    const updateProjectSchema = projectSchema.omit({ _id: true });
    const validatedData = updateProjectSchema.parse(data);

    // Connect to database
    await connectToDatabase();

    // Update project
    const project = await Project.findByIdAndUpdate(
      id, 
      {
        ...validatedData,
        updatedAt: new Date(),
        updatedBy: session.user._id
      },
      { 
        new: true,  // Return the updated document
        runValidators: true  // Run model validations on update
      }
    ).lean(); // Convert to plain object

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    console.error('Failed to update project. Full error:', error);
    
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      console.error('Validation error details:', error.errors);
      return NextResponse.json({ 
        error: 'Invalid project update data', 
        details: error.errors 
      }, { status: 400 });
    }

    // Handle MongoDB connection errors
    if (error instanceof mongoose.Error.MongooseServerSelectionError) {
      console.error('MongoDB connection error:', error);
      return NextResponse.json({ 
        error: 'Database connection failed. Please try again later.' 
      }, { status: 503 });
    }

    if (error instanceof Error) {
      console.error('General error:', error.message);
      return NextResponse.json({ 
        error: error.message || 'An unexpected error occurred' 
      }, { status: error.message.includes('Unauthorized') ? 401 : 500 });
    }

    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

// DELETE project (soft delete)
export async function DELETE(req: NextRequest) {
  try {
    console.log('Starting project deletion...');
    
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await validateAdminAccess(session);
    console.log('Admin access validated');

    await connectToDatabase();
    console.log('Database connected successfully');
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    console.log('Received project ID:', id);

    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
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
    ).lean(); // Convert to plain object
    console.log('Project soft-deleted successfully:', project._id);

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Project soft-deleted successfully',
      project 
    }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete project. Full error:', error);
    
    // Handle MongoDB connection errors
    if (error instanceof mongoose.Error.MongooseServerSelectionError) {
      console.error('MongoDB connection error:', error);
      return NextResponse.json({ 
        error: 'Database connection failed. Please try again later.' 
      }, { status: 503 });
    }

    if (error instanceof Error) {
      console.error('General error:', error.message);
      return NextResponse.json({ error: error.message }, { status: error.message.includes('Unauthorized') ? 401 : 500 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
