import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Subscriber } from '@/models/Subscriber';
import connectToDatabase from '@/lib/db/mongodb';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and is an admin
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    // Get all subscribers, sorted by subscription date
    const subscribers = await Subscriber.find()
      .sort({ subscribedAt: -1 })
      .lean();

    return NextResponse.json({
      subscribers,
    });
  } catch (error) {
    console.error('Subscriber fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscribers' },
      { status: 500 }
    );
  }
}
