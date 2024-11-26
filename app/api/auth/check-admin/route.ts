import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    // Check for any users with admin role
    const adminUser = await db.collection('users').findOne({ role: 'admin' });
    console.log('Admin check result:', { hasAdmin: !!adminUser });
    
    return NextResponse.json({ 
      hasAdmin: !!adminUser,
      adminExists: !!adminUser  
    });
  } catch (error) {
    console.error('Error checking admin existence:', error);
    return NextResponse.json(
      { error: 'Failed to check admin existence' },
      { status: 500 }
    );
  }
}
