import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/db/mongodb';
import { ObjectId } from 'mongodb';
import type { UserAchievement } from '@/types/database';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { db } = await connectDB();

    // Get user's achievements
    const achievements = await db.collection('userAchievements')
      .find({ userId: new ObjectId(session.user.id) })
      .toArray();

    return NextResponse.json(achievements);
  } catch (error) {
    console.error('Failed to fetch achievements:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
