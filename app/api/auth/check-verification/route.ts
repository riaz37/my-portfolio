import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { User } from '@/models/User';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await connectDB();
    
    // Find user and check verification status
    const user = await User.findById(session.user.id)
      .select('emailVerified isVerified verifiedAt')
      .lean();

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      isVerified: Boolean(user.emailVerified || user.isVerified),
      emailVerified: user.emailVerified,
      verifiedAt: user.verifiedAt
    });

  } catch (error) {
    console.error('Error checking verification status:', error);
    return NextResponse.json(
      { error: 'Failed to check verification status' },
      { status: 500 }
    );
  }
}
