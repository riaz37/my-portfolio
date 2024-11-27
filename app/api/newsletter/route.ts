import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Subscriber } from '@/models/Subscriber';
import connectToDatabase from '@/lib/db/mongodb';

const schema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: Request) {
  try {
    // Connect to MongoDB
    await connectToDatabase();

    // Validate request body
    const body = await request.json();
    const { email } = schema.parse(body);

    // Check if email already exists
    const existingSubscriber = await Subscriber.findOne({ email });

    if (existingSubscriber) {
      return NextResponse.json(
        { message: 'You are already subscribed to the newsletter!' },
        { status: 400 }
      );
    }

    // Create new subscriber
    await Subscriber.create({ 
      email,
      isSubscribed: true,
      subscribedAt: new Date()
    });

    return NextResponse.json(
      { message: 'Successfully subscribed to the newsletter!' },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Check for MongoDB duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { message: 'You are already subscribed to the newsletter!' },
        { status: 400 }
      );
    }

    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { message: 'Failed to subscribe to newsletter' },
      { status: 500 }
    );
  }
}
