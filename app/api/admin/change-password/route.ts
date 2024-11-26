import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import bcrypt from 'bcryptjs';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    // Get stored password hash from environment variable
    const storedHash = process.env.ADMIN_PASSWORD_HASH;
    if (!storedHash) {
      return NextResponse.json(
        { message: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, storedHash);
    if (!isValid) {
      return NextResponse.json(
        { message: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);

    // In a real application, you would update the password in a database
    // For this implementation, you'll need to manually update the ADMIN_PASSWORD_HASH
    // in your .env.local file
    
    return NextResponse.json(
      { 
        message: 'Password changed successfully. Please update ADMIN_PASSWORD_HASH in .env.local with:',
        newHash 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json(
      { message: 'Failed to change password' },
      { status: 500 }
    );
  }
}
