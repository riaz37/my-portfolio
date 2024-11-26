import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import Challenge from '@/models/Challenge';
import { connectToDatabase } from '@/lib/mongoose';
import User from '@/models/User';

// Validation schema for challenge update
const challengeUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).optional(),
  category: z.string().min(1).optional(),
  hints: z.array(z.string()).optional(),
  starterCode: z.object({
    javascript: z.string(),
    python: z.string(),
  }).optional(),
  testCases: z.array(z.object({
    input: z.any(),
    output: z.string(),
  })).optional(),
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
    const validatedData = challengeUpdateSchema.parse(body);

    const challenge = await Challenge.findByIdAndUpdate(
      params.id,
      { $set: validatedData },
      { new: true }
    );

    if (!challenge) {
      return new NextResponse('Challenge not found', { status: 404 });
    }

    return NextResponse.json(challenge);
  } catch (error) {
    console.error('Error updating challenge:', error);
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

    const challenge = await Challenge.findByIdAndDelete(params.id);
    if (!challenge) {
      return new NextResponse('Challenge not found', { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting challenge:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
