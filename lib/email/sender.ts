import nodemailer from 'nodemailer';
import { getBaseUrl } from '@/utils/url';

// Validate email configuration
const requiredEnvVars = [
  'EMAIL_SERVER_HOST',
  'EMAIL_SERVER_PORT',
  'EMAIL_SERVER_USER',
  'EMAIL_SERVER_PASSWORD',
  'EMAIL_FROM',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: true, // Use SSL/TLS
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  tls: {
    // Do not fail on invalid certificates
    rejectUnauthorized: process.env.NODE_ENV === 'production'
  }
});

// Verify transporter configuration
let transporterVerified = false;

async function verifyTransporter() {
  if (transporterVerified) return true;
  
  try {
    await transporter.verify();
    transporterVerified = true;
    console.log('Email transporter is ready');
    return true;
  } catch (error) {
    console.error('Email configuration error:', error);
    return false;
  }
}

interface SendVerificationEmailParams {
  email: string;
  token: string;
  name?: string;
}

export async function sendVerificationEmail({ email, token, name }: SendVerificationEmailParams) {
  try {
    const baseUrl = getBaseUrl();
    const verificationUrl = `${baseUrl}/auth/verify-email?token=${encodeURIComponent(token)}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Verify your email address',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1>Verify your email address</h1>
          <p>Hello ${name || 'there'},</p>
          <p>Please click the button below to verify your email address:</p>
          <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
            Verify Email
          </a>
          <p>Or copy and paste this URL into your browser:</p>
          <p>${verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
}

interface SendPasswordResetEmailParams {
  email: string;
  token: string;
  name?: string;
}

export async function sendPasswordResetEmail({ email, token, name }: SendPasswordResetEmailParams) {
  try {
    const baseUrl = getBaseUrl();
    const resetUrl = `${baseUrl}/auth/reset-password?token=${encodeURIComponent(token)}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Reset your password',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1>Reset your password</h1>
          <p>Hello ${name || 'there'},</p>
          <p>Please click the button below to reset your password:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
            Reset Password
          </a>
          <p>Or copy and paste this URL into your browser:</p>
          <p>${resetUrl}</p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this password reset, you can safely ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
}

interface SendNewsletterParams {
  subject: string;
  content: string;
  subscribers: string[];
}

export async function sendNewsletter({ subject, content, subscribers }: SendNewsletterParams) {
  console.log('Preparing to send newsletter...');
  
  if (!subject || !content || !subscribers.length) {
    throw new Error('Missing required parameters for newsletter');
  }

  console.log(`Sending newsletter to ${subscribers.length} subscribers`);

  try {
    // Send emails in batches of 50 to avoid rate limits
    const batchSize = 50;
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);
      
      const emailPromises = batch.map(async (email) => {
        const mailOptions = {
          from: process.env.EMAIL_FROM,
          to: email,
          subject: subject,
          html: content,
        };

        try {
          await transporter.sendMail(mailOptions);
          console.log(`Newsletter sent successfully to ${email}`);
          return { email, success: true };
        } catch (error) {
          console.error(`Failed to send newsletter to ${email}:`, error);
          return { email, success: false, error };
        }
      });

      await Promise.all(emailPromises);
      
      // Wait 1 second between batches to avoid rate limits
      if (i + batchSize < subscribers.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to send newsletter:', error);
    throw error;
  }
}
