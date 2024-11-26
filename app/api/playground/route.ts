import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const games = await db.collection('playground').find({}).toArray();
    return NextResponse.json(games);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const game = await request.json();
    const { db } = await connectToDatabase();
    
    const result = await db.collection('playground').insertOne({
      ...game,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json({ 
      _id: result.insertedId,
      ...game
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to create game' },
      { status: 500 }
    );
  }
}
