import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    
    const type = searchParams.get('type');
    const difficulty = searchParams.get('difficulty');
    const search = searchParams.get('search');

    const { db } = await connectDB();

    // Build query based on filters
    const query: any = {};
    if (type && type !== 'all') query.type = type;
    if (difficulty && difficulty !== 'all') query.difficulty = difficulty;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const resources = await db
      .collection('resources')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    return new NextResponse('Error fetching resources', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { title, description, url, type, tags, difficulty } = body;

    if (!title || !description || !url || !type || !tags || !difficulty) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const { db } = await connectDB();

    const resource = {
      title,
      description,
      url,
      type,
      tags,
      difficulty,
      createdAt: new Date(),
      createdBy: session.user.id,
    };

    await db.collection('resources').insertOne(resource);

    return NextResponse.json(resource);
  } catch (error) {
    console.error('Error creating resource:', error);
    return new NextResponse('Error creating resource', { status: 500 });
  }
}
