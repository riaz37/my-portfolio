import nodemailer from 'nodemailer';

// Validate email configuration
const requiredEnvVars = [
  'EMAIL_SERVER_HOST',
  'EMAIL_SERVER_PORT',
  'EMAIL_SERVER_USER',
  'EMAIL_SERVER_PASSWORD',
  'EMAIL_FROM',
  'NEXTAUTH_URL'
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
  console.log('Preparing to send verification email...');
  
  if (!email || !token) {
    throw new Error('Missing required parameters for verification email');
  }

  // Ensure transporter is verified
  console.log('Verifying email transporter...');
  if (!await verifyTransporter()) {
    throw new Error('Email service is not configured correctly');
  }

  const baseUrl = process.env.NEXTAUTH_URL?.replace(/\/$/, '');
  const verificationUrl = `${baseUrl}/api/verify/email?token=${token}`;

  try {
    console.log('Sending verification email...');
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Verify your email address',
      text: `Hello ${name || 'there'},\n\nClick this link to verify your email: ${verificationUrl}`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; text-align: center;">Welcome${name ? `, ${name}` : ''}!</h1>
          <p style="color: #666; text-align: center;">
            Click the button below to verify your email address and access all features.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}"
               style="background: #0070f3; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Verify Email
            </a>
          </div>
          <p style="color: #999; text-align: center; font-size: 0.9em;">
            If you didn't request this email, you can safely ignore it.
          </p>
        </div>
      `
    });

    console.log('Verification email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw error;
  }
}

interface SendPasswordResetEmailParams {
  email: string;
  token: string;
  name?: string;
}

export async function sendPasswordResetEmail({ email, token, name }: SendPasswordResetEmailParams) {
  console.log('Preparing to send password reset email...');
  
  if (!email || !token) {
    throw new Error('Missing required parameters for password reset email');
  }

  // Ensure transporter is verified
  console.log('Verifying email transporter...');
  if (!await verifyTransporter()) {
    throw new Error('Email service is not configured correctly');
  }

  const baseUrl = process.env.NEXTAUTH_URL?.replace(/\/$/, '');
  const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`;

  try {
    console.log('Sending password reset email...');
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Reset your password',
      text: `Hello ${name || 'there'},\n\nClick this link to reset your password: ${resetUrl}`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; text-align: center;">Reset your password</h1>
          <p style="color: #666; text-align: center;">
            Click the button below to reset your password.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}"
               style="background: #0070f3; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #999; text-align: center; font-size: 0.9em;">
            If you didn't request this email, you can safely ignore it.
          </p>
        </div>
      `
    });

    console.log('Password reset email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    throw error;
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
