import { NextResponse } from 'next/server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Challenge } from '@/lib/models/content/Challenge';

interface Params {
  params: {
    id: string;
  };
}

// GET /api/challenges/[id] - Get a specific challenge
export async function GET(req: Request, { params }: Params) {
  try {
    await connectToDatabase();
    const challenge = await Challenge.findById(params.id);
    
    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(challenge);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch challenge' },
      { status: 500 }
    );
  }
}

// PUT /api/challenges/[id] - Update a challenge
export async function PUT(req: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is admin
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    await connectToDatabase();
    
    const challenge = await Challenge.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true, runValidators: true }
    );
    
    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(challenge);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update challenge' },
      { status: 500 }
    );
  }
}

// DELETE /api/challenges/[id] - Delete a challenge
export async function DELETE(req: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is admin
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const challenge = await Challenge.findByIdAndDelete(params.id);
    
    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Challenge deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete challenge' },
      { status: 500 }
    );
  }
}
