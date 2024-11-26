import NextAuth, { type AuthOptions } from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions satisfies AuthOptions);

export { handler as GET, handler as POST };