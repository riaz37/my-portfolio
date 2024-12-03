import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db/mongodb';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { challengeId, solution } = await request.json();

    if (!challengeId || !solution) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { db } = await connectDB();

    // Save the solution
    await db.collection('solutions').insertOne({
      userId: session.user.id,
      challengeId,
      solution,
      submittedAt: new Date(),
    });

    return NextResponse.json({
      message: 'Solution submitted successfully',
    });
  } catch (error) {
    console.error('Error submitting solution:', error);
    return NextResponse.json(
      { error: 'Error submitting solution' },
      { status: 500 }
    );
  }
}
