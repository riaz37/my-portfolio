import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();

    // Get all users and sort by score
    const users = await db.collection('users')
      .find({}, {
        projection: {
          password: 0, // Exclude password
        }
      })
      .sort({ score: -1 }) // Sort by score in descending order
      .toArray();

    // Add rank to each user
    const rankedUsers = users.map((user, index) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      image: user.image,
      score: user.score || 0,
      rank: index + 1,
      isVerified: user.isVerified || false,
    }));

    return NextResponse.json({ users: rankedUsers });
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
