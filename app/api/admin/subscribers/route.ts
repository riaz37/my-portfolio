import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Subscriber } from '@/models/Subscriber';


export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is admin
    if (!session?.user || !session.user.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const subscribers = await Subscriber.find()
      .sort({ subscribedAt: -1 })
      .select('-__v')
      .lean();

    const activeSubscribers = subscribers.filter(sub => sub.isSubscribed);

    return NextResponse.json({
      subscribers,
      totalSubscribers: subscribers.length,
      activeSubscribers: activeSubscribers.length
    });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscribers' },
      { status: 500 }
    );
  }
}
