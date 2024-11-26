import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET() {
  try {
    // Log environment variables (excluding sensitive data)
    console.log('Email Configuration:', {
      host: process.env.EMAIL_SERVER_HOST,
      port: process.env.EMAIL_SERVER_PORT,
      user: process.env.EMAIL_SERVER_USER,
      from: process.env.EMAIL_FROM,
    });

    // Create test transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      secure: process.env.EMAIL_SERVER_PORT === '465',
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    // Verify transporter
    await transporter.verify();

    // Send test email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_SERVER_USER, // Send to yourself
      subject: 'Test Email',
      text: 'If you receive this email, the email configuration is working correctly.',
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Test email sent successfully',
      messageId: info.messageId 
    });
  } catch (error) {
    console.error('Email test failed:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
