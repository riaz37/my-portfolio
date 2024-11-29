import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Newsletter } from '@/models/content/Newsletter';
import { connectToDatabase } from '@/lib/db/mongodb';
import nodemailer from 'nodemailer';
import { Subscriber } from '@/models/Subscriber';

if (!process.env.EMAIL_SERVER_HOST || !process.env.EMAIL_SERVER_PORT || !process.env.EMAIL_SERVER_USER || !process.env.EMAIL_SERVER_PASSWORD) {
  throw new Error('Missing email server environment variables');
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: true,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is admin
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Get request body
    const { subject, content, test, testEmail } = await request.json();

    if (!subject || !content) {
      return NextResponse.json(
        { error: 'Subject and content are required' },
        { status: 400 }
      );
    }

    // If this is a test email, validate test email
    if (test && !testEmail) {
      return NextResponse.json(
        { error: 'Test email address is required for test sends' },
        { status: 400 }
      );
    }

    const mailOptions = {
      from: process.env.EMAIL_SERVER_USER,
      subject: subject,
      html: content,
    };

    // Handle test email
    if (test && testEmail) {
      const info = await transporter.sendMail({
        ...mailOptions,
        to: testEmail,
      });

      // Save test newsletter to database
      const newsletter = await Newsletter.create({
        subject,
        content,
        sentAt: new Date(),
        sentBy: session.user.id,
        recipientCount: 1,
        successCount: 1,
        failureCount: 0,
        isTest: true,
        testEmail,
      });

      return NextResponse.json({
        message: 'Test email sent successfully',
        newsletterId: newsletter._id,
        messageId: info.messageId
      });
    }

    // Get all active subscribers
    const subscribers = await Subscriber.find({ isSubscribed: true });

    if (subscribers.length === 0) {
      return NextResponse.json(
        { error: 'No active subscribers found' },
        { status: 400 }
      );
    }

    // Send to all subscribers
    const results = await Promise.all(
      subscribers.map(async (subscriber) => {
        try {
          const info = await transporter.sendMail({
            ...mailOptions,
            to: subscriber.email,
          });

          return { email: subscriber.email, status: 'success', id: info.messageId };
        } catch (error) {
          console.error(`Failed to send to ${subscriber.email}:`, error);
          return { email: subscriber.email, status: 'failed', error };
        }
      })
    );

    // Save newsletter to database
    const newsletter = await Newsletter.create({
      subject,
      content,
      sentAt: new Date(),
      sentBy: session.user.id,
      recipientCount: subscribers.length,
      successCount: results.filter(r => r.status === 'success').length,
      failureCount: results.filter(r => r.status === 'failed').length,
      isTest: false,
    });

    return NextResponse.json({
      message: 'Newsletter sent successfully',
      newsletterId: newsletter._id,
      results
    });

  } catch (error) {
    console.error('Error sending newsletter:', error);
    return NextResponse.json(
      { error: 'Failed to send newsletter' },
      { status: 500 }
    );
  }
}
