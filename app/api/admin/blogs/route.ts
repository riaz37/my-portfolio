import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Blog } from '@/models/Blog';
import { authOptions } from '@/lib/auth';
import { validateAdminAccess } from '@/lib/auth/admin';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    await validateAdminAccess(session);

    await connectToDatabase();
    const blogs = await Blog.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .populate('author', 'name email')
      .lean();

    return NextResponse.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes('Unauthorized') ? 401 : 500 }
      );
    }
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    await validateAdminAccess(session);

    const data = await request.json();
    await connectToDatabase();
    const blog = await Blog.create({
      ...data,
      createdBy: session.user.id
    });
    return NextResponse.json(blog);
  } catch (error) {
    console.error('Failed to create blog:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes('Unauthorized') ? 401 : 500 }
      );
    }
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    await validateAdminAccess(session);

    const data = await request.json();
    const { id, ...updateData } = data;

    await connectToDatabase();
    const blog = await Blog.findByIdAndUpdate(
      id,
      {
        ...updateData,
        updatedBy: session.user.id,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Failed to update blog:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes('Unauthorized') ? 401 : 500 }
      );
    }
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    await validateAdminAccess(session);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Blog ID is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    console.error('Failed to delete blog:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes('Unauthorized') ? 401 : 500 }
      );
    }
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}