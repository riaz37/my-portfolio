import { OAuthUserConfig } from 'next-auth/providers';
import GoogleProvider from 'next-auth/providers/google';

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error('Missing GOOGLE_CLIENT_ID environment variable');
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('Missing GOOGLE_CLIENT_SECRET environment variable');
}

export const googleConfig: OAuthUserConfig<any> = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  profile(profile) {
    return {
      id: profile.sub,
      name: profile.name,
      email: profile.email,
      image: profile.picture,
      emailVerified: profile.email_verified,
      role: 'user',
    };
  },
};
