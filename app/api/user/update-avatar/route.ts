import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db/mongodb';
import { User } from '@/models/User';

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { avatarUrl } = await request.json();

    if (!avatarUrl) {
      return NextResponse.json({ error: 'Avatar URL is required' }, { status: 400 });
    }

    await connectToDatabase();

    // Update user's avatar
    await User.findByIdAndUpdate(session.user.id, {
      avatarUrl,
      updatedAt: new Date()
    });

    return NextResponse.json({
      success: true,
      image: avatarUrl
    });
  } catch (error) {
    console.error('Error updating avatar:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
