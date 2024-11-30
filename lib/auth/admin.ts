import { Session } from 'next-auth';
import { User } from '@/models/auth';

export async function validateAdminAccess(session: Session | null) {
  if (!session?.user?.email) {
    throw new Error('Unauthorized access');
  }

  const user = await User.findOne({ email: session.user.email });
  if (!user?.isAdmin) {
    throw new Error('Admin access required');
  }

  return user;
}
