import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { progressService } from '@/services/progress';
import connectDB from '@/lib/db/mongodb';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const learningPathId = searchParams.get('learningPathId');

    if (!learningPathId) {
      return new NextResponse('Learning path ID is required', { status: 400 });
    }

    await connectDB();
    const progress = await progressService.getUserProgress(session.user.id, learningPathId);

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { resourceId, skillId, learningPathId, completed } = body;

    if (!resourceId || !skillId || !learningPathId) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    await connectDB();
    const progress = await progressService.markResourceComplete(
      session.user.id,
      learningPathId,
      resourceId,
      skillId,
      completed
    );

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error updating progress:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET_LAST_PATH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connectDB();

    const lastPathId = await progressService.getLastAccessedPath(session.user.id);
    return NextResponse.json({ learningPathId: lastPathId });
  } catch (error) {
    console.error('Error fetching last path:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
