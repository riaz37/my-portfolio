import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db/mongodb';
import { ObjectId } from 'mongodb';
import type { UserSkill } from '@/types/database';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { db } = await connectDB();

    // Get user's skills
    const skills = await db.collection('userSkills')
      .find({ userId: new ObjectId(session.user.id) })
      .toArray();

    return NextResponse.json(skills);
  } catch (error) {
    console.error('Failed to fetch skills:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { skillName, level, xp } = await request.json();

    if (!skillName || typeof level !== 'number') {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { db } = await connectDB();
    const now = new Date();

    // Update or create the skill
    const result = await db.collection('userSkills').updateOne(
      {
        userId: new ObjectId(session.user.id),
        skillName,
      },
      {
        $set: {
          level: Math.min(100, Math.max(1, level)), // Ensure level is between 1-100
          xp: xp || 0,
          updatedAt: now,
        },
        $setOnInsert: {
          userId: new ObjectId(session.user.id),
          skillName,
          gamesCompleted: [],
          createdAt: now,
        },
      },
      { upsert: true }
    );

    return NextResponse.json({
      message: 'Skill updated successfully',
      updated: result.modifiedCount > 0,
      created: result.upsertedCount > 0,
    });
  } catch (error) {
    console.error('Failed to update skill:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
