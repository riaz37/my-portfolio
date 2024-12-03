import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { score, action } = await request.json();

    if (typeof score !== 'number') {
      return NextResponse.json(
        { error: 'Invalid score value' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    let updateOperation;
    if (action === 'set') {
      updateOperation = { $set: { score } };
    } else {
      updateOperation = { $inc: { score } };
    }

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(session.user.id) },
      updateOperation
    );

    if (!result.modifiedCount) {
      return NextResponse.json(
        { error: 'Failed to update score' },
        { status: 400 }
      );
    }

    // Get updated user data
    const updatedUser = await db.collection('users').findOne(
      { _id: new ObjectId(session.user.id) },
      { projection: { score: 1 } }
    );

    return NextResponse.json({
      success: true,
      score: updatedUser?.score || 0
    });
  } catch (error) {
    console.error('Failed to update score:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();

    const user = await db.collection('users').findOne(
      { _id: new ObjectId(session.user.id) },
      { projection: { score: 1 } }
    );

    return NextResponse.json({
      score: user?.score || 0
    });
  } catch (error) {
    console.error('Failed to fetch score:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
