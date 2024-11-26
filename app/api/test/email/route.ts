import { NextResponse } from 'next/server';
import { sendVerificationEmail } from '@/lib/email/sender';
import { headers } from 'next/headers';

export async function POST(request: Request) {
  try {
    // Only allow in development
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { error: 'Test endpoint only available in development' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Generate a test token
    const testToken = 'test-' + Date.now().toString();

    console.log('Testing email sending to:', email);
    console.log('Test token:', testToken);

    // Attempt to send email
    await sendVerificationEmail(email, testToken);

    return NextResponse.json({
      message: 'Test email sent successfully',
      token: testToken
    });

  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send test email',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
