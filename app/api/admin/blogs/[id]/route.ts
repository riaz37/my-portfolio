import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Blog } from '@/models/Blog';
import { authOptions } from '@/lib/auth';
import { validateAdminAccess } from '@/lib/auth/admin';
import { Types } from 'mongoose';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    await validateAdminAccess(session);

    // Validate the ObjectId
    if (!Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid blog ID' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const blog = await Blog.findById(params.id).lean();

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    await validateAdminAccess(session);

    // Validate the ObjectId
    if (!Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid blog ID format' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const blogData = await request.json();
    console.log('Received blog data:', blogData);

    // Validate required fields
    if (!blogData.title || !blogData.content || !blogData.excerpt) {
      return NextResponse.json(
        { error: 'Title, content, and excerpt are required' },
        { status: 400 }
      );
    }

    const updateData = {
      title: blogData.title.trim(),
      content: blogData.content.trim(),
      excerpt: blogData.excerpt.trim(),
      coverImage: blogData.coverImage?.trim() || '',
      tags: Array.isArray(blogData.tags) ? blogData.tags : [],
      published: Boolean(blogData.published),
      slug: blogData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      updatedAt: new Date(),
    };

    const updatedBlog = await Blog.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    ).lean();

    if (!updatedBlog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    await validateAdminAccess(session);

    // Validate the ObjectId
    if (!Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid blog ID' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const deletedBlog = await Blog.findByIdAndDelete(params.id).lean();

    if (!deletedBlog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
