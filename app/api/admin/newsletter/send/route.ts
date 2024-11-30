import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db/mongodb';
import { User } from '@/models/auth';
import { Newsletter } from '@/models/Newsletter';
import { Subscriber } from '@/models/Subscriber';
import nodemailer from 'nodemailer';
import { validateAdminAccess } from '@/lib/auth/admin';

// Validate email server configuration
const validateEmailConfig = () => {
  const requiredVars = [
    'EMAIL_SERVER_HOST', 
    'EMAIL_SERVER_PORT', 
    'EMAIL_SERVER_USER', 
    'EMAIL_SERVER_PASSWORD'
  ];

  const missingVars = requiredVars.filter(
    varName => !process.env[varName]
  );

  if (missingVars.length > 0) {
    throw new Error(`Missing email server environment variables: ${missingVars.join(', ')}`);
  }
};

// Newsletter send schema
const newsletterSendSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  content: z.string().min(1, 'Content is required'),
  test: z.boolean().optional().default(false),
  testEmail: z.string().email().optional(),
});

// Create email transporter
const createTransporter = () => {
  validateEmailConfig();

  return nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT),
    secure: true,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });
};

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    await validateAdminAccess(session);

    await connectToDatabase();
    
    const user = await User.findOne({ email: session.user.email });

    // Validate request body
    const body = await request.json();
    const { subject, content, test, testEmail } = newsletterSendSchema.parse(body);

    // Create email transporter
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_SERVER_USER,
      subject,
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
        sentBy: user._id,
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
    const subscribers = await Subscriber.find({ 
      isSubscribed: true,
      isDeleted: false 
    });

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

          return { 
            email: subscriber.email, 
            status: 'success', 
            id: info.messageId 
          };
        } catch (error) {
          console.error(`Failed to send to ${subscriber.email}:`, error);
          return { 
            email: subscriber.email, 
            status: 'failed', 
            error: error instanceof Error ? error.message : 'Unknown error' 
          };
        }
      })
    );

    // Save newsletter to database
    const newsletter = await Newsletter.create({
      subject,
      content,
      sentAt: new Date(),
      sentBy: user._id,
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
    
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid newsletter data', 
          details: error.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to send newsletter' },
      { status: 500 }
    );
  }
}
