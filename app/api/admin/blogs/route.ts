import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase, { getMongoDb } from '@/lib/db/mongodb';
import { Blog } from '@/models/Blog';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const blogs = await Blog.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const { title, content, excerpt, coverImage, tags, published } = await request.json();

    // Validate required fields
    if (!title || !content || !excerpt) {
      return NextResponse.json(
        { error: 'Title, content, and excerpt are required' },
        { status: 400 }
      );
    }

    const blog = await Blog.create({
      title,
      content,
      excerpt,
      coverImage: coverImage || '',
      tags: tags || [],
      published: published || false,
      authorEmail: session.user.email,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      views: 0
    });

    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}