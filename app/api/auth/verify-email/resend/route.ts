import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/email/sender';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../[...nextauth]/route';
import { headers } from 'next/headers';
import { rateLimit } from '@/lib/rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

export async function POST(req: Request) {
  try {
    // Get client IP for rate limiting
    const headersList = headers();
    const clientIp = headersList.get('x-forwarded-for') || 'unknown';
    
    // Check rate limit (5 requests per minute per IP)
    try {
      await limiter.check(5, clientIp);
    } catch {
      return NextResponse.json(
        { 
          error: 'Too many requests. Please wait a minute before trying again.',
          remainingTime: 60 // seconds
        },
        { status: 429 }
      );
    }

    // Get user session
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { db } = await connectDB();

    // Find user and check verification status
    const user = await db.collection('users').findOne(
      { email: session.user.email }
    );

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json({
        verified: true,
        message: 'Email is already verified'
      });
    }

    // Check per-user rate limit (1 minute cooldown)
    const now = new Date();
    if (user.lastVerificationRequest) {
      const timeSinceLastRequest = now.getTime() - new Date(user.lastVerificationRequest).getTime();
      if (timeSinceLastRequest < 60000) { // 1 minute
        const remainingTime = Math.ceil((60000 - timeSinceLastRequest) / 1000);
        return NextResponse.json(
          { 
            error: `Please wait ${remainingTime} seconds before requesting another email`,
            remainingTime,
            nextRequest: new Date(now.getTime() + (remainingTime * 1000)).toISOString()
          },
          { status: 429 }
        );
      }
    }

    // Delete any existing verification tokens
    await db.collection('VerificationToken').deleteMany({
      userId: user._id.toString(),
      type: 'email-verification'
    });

    // Generate new token
    const token = await generateVerificationToken(user._id.toString());
    
    if (!token) {
      return NextResponse.json(
        { error: 'Failed to generate verification token' },
        { status: 500 }
      );
    }

    // Send verification email
    try {
      await sendVerificationEmail(user.email, token);
    } catch (error) {
      console.error('Failed to send verification email:', error);
      return NextResponse.json(
        { error: 'Failed to send verification email' },
        { status: 500 }
      );
    }

    // Update last verification request time
    await db.collection('users').updateOne(
      { _id: user._id },
      { $set: { lastVerificationRequest: now } }
    );

    return NextResponse.json({
      success: true,
      message: 'Verification email sent'
    });
  } catch (error) {
    console.error('Error in resend verification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
