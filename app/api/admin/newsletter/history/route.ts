import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Newsletter } from '@/models/content/Newsletter';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Subscriber } from '@/models/Subscriber';
import { User } from '@/models/User'; // Import the User model

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // Verify admin status
    const user = await User.findOne({ email: session.user.email });
    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Get all newsletters, sorted by sentAt in descending order
    const newsletters = await Newsletter.find()
      .sort({ sentAt: -1 })
      .select('-content') // Exclude content to reduce payload size
      .lean()
      .limit(50); // Limit to last 50 newsletters

    // Get subscriber count
    const subscriberCount = await Subscriber.countDocuments({
      isSubscribed: true,
      deletedAt: null
    });

    return NextResponse.json({
      newsletters,
      subscriberCount
    });
  } catch (error) {
    console.error('Error fetching newsletter history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch newsletter history' },
      { status: 500 }
    );
  }
}
