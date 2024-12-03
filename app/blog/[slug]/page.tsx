import { connectToDatabase } from '@/lib/db/mongodb';
import { Blog } from '@/models/Blog';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { notFound } from 'next/navigation';
import BlogPost from './blog-post';

export const revalidate = 60; // Revalidate every 60 seconds

async function getBlogPost(slug: string) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    
    const isAdmin = session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const query = {
      slug,
      isDeleted: false,
      ...(isAdmin ? {} : { isPublished: true }),
    };

    const blog = await Blog.findOne(query)
      .select({
        _id: 1,
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
      return null;
    }

    // Increment view count asynchronously
    Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } }).exec();

    // Convert MongoDB document to plain object and handle dates
    const serializedBlog = {
      ...blog,
      _id: blog._id.toString(),
      createdAt: blog.createdAt.toISOString(),
      updatedAt: blog.updatedAt.toISOString(),
      publishedAt: blog.publishedAt ? blog.publishedAt.toISOString() : null,
    };

    return serializedBlog;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

export default async function Page({ params }: { params: { slug: string } }) {
  const blog = await getBlogPost(params.slug);

  if (!blog) {
    notFound();
  }

  return <BlogPost blog={blog} />;
}
