import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import Challenge from '@/models/Challenge';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/challenges - Get all challenges
export async function GET() {
  try {
    await connectToDatabase();
    const challenges = await Challenge.find({}).sort({ createdAt: -1 });
    return NextResponse.json(challenges);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch challenges' },
      { status: 500 }
    );
  }
}

// POST /api/challenges - Create a new challenge
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is admin
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    await connectToDatabase();
    
    const challenge = await Challenge.create(body);
    return NextResponse.json(challenge, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create challenge' },
      { status: 500 }
    );
  }
}
