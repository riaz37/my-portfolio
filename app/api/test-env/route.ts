import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        envCheck: {
            adminUsernameExists: !!process.env.ADMIN_USERNAME,
            adminUsername: process.env.ADMIN_USERNAME,
            adminPasswordHashExists: !!process.env.ADMIN_PASSWORD_HASH,
            adminPasswordHashLength: process.env.ADMIN_PASSWORD_HASH?.length || 0,
            nextAuthSecretExists: !!process.env.NEXTAUTH_SECRET,
            nextAuthUrlExists: !!process.env.NEXTAUTH_URL,
        }
    });
}
