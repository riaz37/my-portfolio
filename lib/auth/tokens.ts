import { randomBytes } from 'crypto';
import { connectToDatabase } from '@/lib/db/mongodb';
import { VerificationToken } from '@/models/auth/VerificationToken';

export async function generateVerificationToken(userId: string) {
  const token = randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

  try {
    console.log('Connecting to database for token generation...');
    await connectToDatabase();

    console.log('Deleting existing tokens...');
    await VerificationToken.deleteMany({ 
      userId, 
      type: 'email-verification' 
    });

    console.log('Creating new verification token...');
    const verificationToken = await VerificationToken.create({
      token,
      userId,
      type: 'email-verification',
      expires,
    });

    console.log('Token created successfully');
    return verificationToken;
  } catch (error) {
    console.error('Error generating verification token:', error);
    throw error; // Re-throw to handle in the calling function
  }
}

export async function generatePasswordResetToken(userId: string) {
  const token = randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour from now

  try {
    console.log('Connecting to database for password reset token...');
    await connectToDatabase();

    console.log('Deleting existing password reset tokens...');
    await VerificationToken.deleteMany({ 
      userId, 
      type: 'password-reset' 
    });

    console.log('Creating new password reset token...');
    const resetToken = await VerificationToken.create({
      token,
      userId,
      type: 'password-reset',
      expires,
    });

    console.log('Password reset token created successfully');
    return resetToken;
  } catch (error) {
    console.error('Error generating password reset token:', error);
    throw error; // Re-throw to handle in the calling function
  }
}
