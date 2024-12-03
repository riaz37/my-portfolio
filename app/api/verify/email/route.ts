import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { verifyToken } from '@/lib/auth/tokens';
import User from '@/models/auth/User';
import { getBaseUrl } from '@/utils/url';

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token');
    
    if (!token) {
      const baseUrl = getBaseUrl();
      return NextResponse.redirect(`${baseUrl}/auth/error?error=missing_token`);
    }

    await connectToDatabase();
    
    // Verify the token
    const payload = await verifyToken(token, 'email_verification');
    if (!payload || !payload.email) {
      const baseUrl = getBaseUrl();
      return NextResponse.redirect(`${baseUrl}/auth/error?error=invalid_token`);
    }

    // Update user verification status
    const user = await User.findOneAndUpdate(
      { email: payload.email },
      { 
        $set: { 
          emailVerified: new Date(),
          isVerified: true,
          verifiedAt: new Date()
        } 
      },
      { new: true }
    );

    if (!user) {
      const baseUrl = getBaseUrl();
      return NextResponse.redirect(`${baseUrl}/auth/error?error=user_not_found`);
    }

    // Redirect to success page
    const baseUrl = getBaseUrl();
    return NextResponse.redirect(`${baseUrl}/auth/signin?verified=true`);
    
  } catch (error) {
    console.error('Email verification error:', error);
    const baseUrl = getBaseUrl();
    return NextResponse.redirect(`${baseUrl}/auth/error?error=verification_failed`);
  }
}
