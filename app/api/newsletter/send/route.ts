import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/db/mongodb';
import Newsletter from '@/models/Newsletter';
import { sendNewsletter } from '@/lib/email/sender';
import { authOptions } from '@/lib/auth';

const schema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  content: z.string().min(1, 'Content is required'),
});

export async function POST(request: Request) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || session.user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validate request body
    const body = await request.json();
    const { subject, content } = schema.parse(body);

    // Get all subscribers
    await connectToDatabase();
    const subscribers = await Newsletter.find().select('email');
    const subscriberEmails = subscribers.map(sub => sub.email);

    if (!subscriberEmails.length) {
      return NextResponse.json(
        { message: 'No subscribers found' },
        { status: 400 }
      );
    }

    // Send newsletter
    await sendNewsletter(subject, content, subscriberEmails);

    return NextResponse.json(
      { 
        message: 'Newsletter sent successfully',
        subscriberCount: subscriberEmails.length
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid input' },
        { status: 400 }
      );
    }

    console.error('Newsletter sending error:', error);
    return NextResponse.json(
      { message: 'Failed to send newsletter' },
      { status: 500 }
    );
  }
}
