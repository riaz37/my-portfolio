import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Newsletter } from '@/models/content';
import { connectToDatabase } from '@/lib/db';

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Get all subscribers with their preferences
    const subscribers = await Newsletter.find({})
      .select('email isSubscribed subscriptionDate preferences lastEmailSent bounceCount')
      .sort({ subscriptionDate: -1 });

    // Format the response data
    const formattedSubscribers = subscribers.map(sub => ({
      email: sub.email,
      isSubscribed: sub.isSubscribed,
      subscriptionDate: sub.subscriptionDate,
      preferences: sub.preferences,
      lastEmailSent: sub.lastEmailSent,
      bounceCount: sub.bounceCount
    }));

    return NextResponse.json(formattedSubscribers);
  } catch (error) {
    console.error('Error fetching newsletter subscribers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscribers' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const { email } = await req.json();
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    await Newsletter.deleteOne({ email });

    return NextResponse.json({ message: 'Subscriber deleted successfully' });
  } catch (error) {
    console.error('Error deleting subscriber:', error);
    return NextResponse.json(
      { error: 'Failed to delete subscriber' },
      { status: 500 }
    );
  }
}
