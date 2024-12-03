import { Session } from 'next-auth';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/models/auth/User';

export async function validateAdminAccess(session: Session | null) {
  try {
    // Ensure database connection
    await connectToDatabase();

    if (!session?.user?.email) {
      console.error('No user email in session');
      throw new Error('Unauthorized access');
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      console.error('User not found:', session.user.email);
      throw new Error('User not found');
    }

    if (!user.isAdmin) {
      console.error('User is not an admin:', session.user.email);
      throw new Error('Admin access required');
    }

    return user;
  } catch (error) {
    console.error('Admin access validation error:', error);
    throw error;
  }
}

export async function createFirstAdminUser(email: string, password: string, name: string = 'Admin') {
  try {
    // Ensure database connection
    await connectToDatabase();

    // Check if an admin already exists
    const existingAdmin = await User.findOne({ isAdmin: true });
    if (existingAdmin) {
      console.warn('An admin user already exists');
      return null;
    }

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.warn('User with this email already exists');
      return null;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the first admin user
    const adminUser = await User.create({
      name,
      email,
      password: hashedPassword,
      isAdmin: true,
      role: 'admin',
      isVerified: true,
      emailVerified: new Date(),
      verifiedAt: new Date()
    });

    console.log('First admin user created successfully');
    return adminUser;
  } catch (error) {
    console.error('Error creating first admin user:', error);
    throw error;
  }
}

export async function promoteUserToAdmin(email: string) {
  try {
    // Ensure database connection
    await connectToDatabase();

    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      console.error('User not found:', email);
      throw new Error('User not found');
    }

    // Update user to admin
    user.isAdmin = true;
    user.role = 'admin';
    await user.save();

    console.log('User promoted to admin:', email);
    return user;
  } catch (error) {
    console.error('Error promoting user to admin:', error);
    throw error;
  }
}

export async function checkAdminExists() {
  try {
    // Ensure database connection
    await connectToDatabase();

    // Check if any admin exists
    const adminCount = await User.countDocuments({ isAdmin: true });
    return adminCount > 0;
  } catch (error) {
    console.error('Error checking admin existence:', error);
    return false;
  }
}
