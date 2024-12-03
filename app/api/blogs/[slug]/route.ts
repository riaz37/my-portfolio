import { NextResponse } from 'next/server';
import { Blog } from '@/models/Blog';
import { connectToDatabase } from '@/lib/db/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    await connectToDatabase();
    
    const slug = params.slug;
    const isAdmin = session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

    const query = {
      slug,
      isDeleted: false,
      ...(isAdmin ? {} : { isPublished: true }),
    };

    const blog = await Blog.findOne(query)
      .select({
        title: 1,
        description: 1,
        content: 1,
        slug: 1,
        tags: 1,
        author: 1,
        coverImage: 1,
        readingTime: 1,
        views: 1,
        likes: 1,
        isPublished: 1,
        publishedAt: 1,
        createdAt: 1,
        updatedAt: 1,
      })
      .lean();

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } });

    return NextResponse.json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}
