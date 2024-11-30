import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Newsletter } from '@/models/content';
import { authOptions } from '@/lib/auth';
import { validateAdminAccess } from '@/lib/auth/admin';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    await validateAdminAccess(session);

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
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes('Unauthorized') ? 401 : 500 }
      );
    }
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    await validateAdminAccess(session);

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
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes('Unauthorized') ? 401 : 500 }
      );
    }
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
