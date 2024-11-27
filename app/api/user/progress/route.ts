import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db/mongodb';
import { UserProgress } from '@/models/user/UserProgress';

// GET user progress
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const userProgress = await UserProgress.findOne({ userId: session.user.email })
      .select('progress level experience achievements')
      .lean();

    if (!userProgress) {
      // Create initial progress if it doesn't exist
      const newProgress = await UserProgress.create({
        userId: session.user.email,
        progress: {},
        level: 1,
        experience: 0,
        achievements: [],
      });
      return NextResponse.json({
        progress: newProgress.progress,
        level: newProgress.level,
        experience: newProgress.experience,
        achievements: newProgress.achievements,
      });
    }

    return NextResponse.json(userProgress);
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user progress' },
      { status: 500 }
    );
  }
}

// POST update user progress
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sectionId, progress, achievement } = await request.json();
    if (typeof sectionId !== 'string' || typeof progress !== 'number') {
      return NextResponse.json(
        { error: 'Invalid progress data' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Use upsert to create if not exists
    const userProgress = await UserProgress.findOneAndUpdate(
      { userId: session.user.email },
      { 
        $set: { [`progress.${sectionId}`]: progress },
        $setOnInsert: { 
          userId: session.user.email,
          level: 1,
          experience: 0,
          achievements: [],
        },
        // Add achievement if provided
        ...(achievement && { $addToSet: { achievements: achievement } }),
        // Increment experience
        $inc: { experience: Math.floor(progress * 10) },
      },
      { upsert: true, new: true }
    );

    // Check if user should level up
    const nextLevelExperience = Math.pow(userProgress.level, 2) * 100;
    if (userProgress.experience >= nextLevelExperience) {
      userProgress.level += 1;
      await userProgress.save();
    }

    return NextResponse.json({
      progress: userProgress.progress,
      level: userProgress.level,
      experience: userProgress.experience,
      achievements: userProgress.achievements,
    });
  } catch (error) {
    console.error('Error updating user progress:', error);
    return NextResponse.json(
      { error: 'Failed to update user progress' },
      { status: 500 }
    );
  }
}
