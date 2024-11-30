import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db/mongodb';
import { User } from '@/models/auth';
import { Skill } from '@/models/Skill';
import { validateAdminAccess } from '@/lib/auth/admin';

const skillSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  icon: z.string().min(1, 'Icon is required'),
  level: z.enum(['beginner', 'intermediate', 'advanced'], {
    required_error: 'Skill level is required',
  }),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    await validateAdminAccess(session);

    await connectToDatabase();
    
    const skills = await Skill.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email');

    return NextResponse.json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
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
    await validateAdminAccess(session);

    await connectToDatabase();
    
    const body = await request.json();
    const validatedData = skillSchema.parse(body);

    const skill = await Skill.create({
      ...validatedData,
      createdBy: session.user.id,
    });

    return NextResponse.json(skill);
  } catch (error) {
    console.error('Error creating skill:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
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
