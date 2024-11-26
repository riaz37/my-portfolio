import { NextRequest, NextResponse } from 'next/server';
import { hash, compare } from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/models/auth/User';

export async function PUT(request: NextRequest) {
  try {
    // Get the current user's session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'You must be logged in to change your password' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Get request body
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Get user from database
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify current password
    const isValid = await compare(currentPassword, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await hash(newPassword, 12);

    // Update password
    user.password = hashedPassword;
    user.updatedAt = new Date();
    await user.save();

    return NextResponse.json({
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { error: 'Failed to change password' },
      { status: 500 }
    );
  }
}
