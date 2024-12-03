import { connectToDatabase } from '@/lib/db/mongodb';
import { Blog } from '@/models/Blog';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { notFound } from 'next/navigation';
import BlogPostPage from './page';

export const revalidate = 60; // Revalidate every 60 seconds

async function getBlogPost(slug: string) {
  try {
    const session = await getServerSession(authOptions);
    await connectToDatabase();
    
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
      return null;
    }

    // Increment view count
    await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } });

    return blog;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

export default async function BlogPostServerPage({ params }: { params: { slug: string } }) {
  const blog = await getBlogPost(params.slug);

  if (!blog) {
    notFound();
  }

  return <BlogPostPage params={params} initialData={blog} />;
}
