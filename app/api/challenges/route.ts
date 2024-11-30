import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Challenge } from '@/lib/models/content/Challenge';


// GET /api/challenges - Get all challenges
export async function GET() {
  try {
    await connectToDatabase();

    const challenges = await Challenge.find()
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email')
      .select('-__v');

    return NextResponse.json(challenges);
  } catch (error) {
    console.error('Error fetching challenges:', error);
    return NextResponse.json(
      { error: 'Failed to fetch challenges' },
      { status: 500 }
    );
  }
}

// POST /api/challenges - Create a new challenge
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is admin
    if (!session?.user || !session.user.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, difficulty, category, testCases } = body;

    // Validate required fields
    if (!title || !description || !difficulty || !category || !testCases) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const challenge = await Challenge.create({
      title,
      description,
      difficulty,
      category,
      testCases,
      createdBy: session.user.id,
    });

    return NextResponse.json(challenge, { status: 201 });
  } catch (error) {
    console.error('Error creating challenge:', error);
    return NextResponse.json(
      { error: 'Failed to create challenge' },
      { status: 500 }
    );
  }
}
