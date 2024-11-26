import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { randomBytes } from 'crypto';
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/models/auth/User';
import { generatePasswordResetToken } from '@/lib/auth/tokens';
import { VerificationToken } from '@/models/auth/VerificationToken';
import { sendPasswordResetEmail } from '@/lib/email/sender';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    console.log('Password reset requested for:', email);

    await connectToDatabase();

    // Check if user exists
    const user = await User.findOne({ email });
    console.log('User found:', !!user);

    if (!user && email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json(
        { message: 'If an account exists with this email, you will receive password reset instructions.' },
        { status: 200 }
      );
    }

    if (email === process.env.ADMIN_EMAIL) {
      // Admin password reset
      const tempPassword = randomBytes(4).toString('hex');
      const hashedPassword = await hash(tempPassword, 10);

      // Update the password hash in .env.local
      const fs = require('fs');
      const path = require('path');
      const envPath = path.join(process.cwd(), '.env.local');
      let envContent = fs.readFileSync(envPath, 'utf8');
      
      envContent = envContent.replace(
        /ADMIN_PASSWORD_HASH=.*/,
        `ADMIN_PASSWORD_HASH=${hashedPassword}`
      );
      
      fs.writeFileSync(envPath, envContent);

      // Send admin reset email with temp password
      await sendPasswordResetEmail({
        email,
        token: tempPassword,
        name: 'Admin'
      });
      console.log('Admin reset email sent');
    } else {
      // Regular user password reset
      console.log('Generating reset token for user:', user._id);
      const token = await generatePasswordResetToken(user._id);
      console.log('Reset token generated:', token);

      // Send user reset email
      await sendPasswordResetEmail({
        email,
        token: token.token, // Make sure we're sending the token string
        name: user.name
      });
      console.log('Reset email sent to user');
    }

    return NextResponse.json({ 
      message: 'If an account exists with this email, you will receive password reset instructions.' 
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Failed to process password reset' },
      { status: 500 }
    );
  }
}

// Handle password reset with token
export async function PUT(request: Request) {
  try {
    const { token, password } = await request.json();
    console.log('Attempting password reset with token');

    if (!token || !password) {
      console.log('Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    console.log('Connected to database');
    
    // Find the reset token
    const resetToken = await VerificationToken.findOne({
      token,
      type: 'password-reset',
      expires: { $gt: new Date() }
    });
    console.log('Reset token found:', !!resetToken);

    if (!resetToken) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // Update user's password
    const hashedPassword = await hash(password, 12);
    const user = await User.findById(resetToken.userId);
    console.log('User found for password update:', !!user);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update password and delete token
    user.password = hashedPassword;
    user.updatedAt = new Date();
    await user.save();
    console.log('Password updated');
    
    await resetToken.deleteOne();
    console.log('Reset token deleted');

    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password update error:', error);
    return NextResponse.json(
      { error: 'Failed to update password' },
      { status: 500 }
    );
  }
}
