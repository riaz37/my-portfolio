import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import Challenge from '@/models/Challenge';
import User from '@/models/User'; // Added missing import
import { connectToDatabase } from '@/lib/mongoose';

// Validation schema for challenge
const challengeSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  category: z.string().min(1),
  hints: z.array(z.string()),
  starterCode: z.object({
    javascript: z.string(),
    python: z.string(),
  }),
  testCases: z.array(z.object({
    input: z.any(),
    output: z.string(),
  })),
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
    if (!user?.isAdmin) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const validatedData = challengeSchema.parse(body);

    const challenge = await Challenge.create({
      ...validatedData,
      createdBy: user._id,
    });

    return NextResponse.json(challenge);
  } catch (error) {
    console.error('Error creating challenge:', error);
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

    const challenges = await Challenge.find()
      .sort({ createdAt: -1 });

    return NextResponse.json(challenges);
  } catch (error) {
    console.error('Error fetching challenges:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
