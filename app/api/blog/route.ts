import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Blog } from '@/models/Blog';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    const getTags = searchParams.get('getTags') === 'true';

    console.log('Blog API Request:', { slug, tag, search, getTags });

    // Connect to the database
    await connectToDatabase();
    
    if (slug) {
      console.log(`Fetching blog post with slug: ${slug}`);
      const post = await Blog.findOne({ slug, published: true });
      
      if (!post) {
        console.log(`Blog post not found for slug: ${slug}`);
        return new NextResponse(JSON.stringify({ 
          success: false,
          error: 'Blog post not found'
        }), { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Increment view count
      post.views = (post.views || 0) + 1;
      await post.save();

      return NextResponse.json({
        success: true,
        data: post
      });
    }

    // Get all published posts
    const query: any = { published: true };
    if (tag) {
      query.tags = tag;
    }

    let posts = await Blog.find(query)
      .sort({ createdAt: -1 })
      .select('title slug excerpt content coverImage tags published views authorEmail createdAt updatedAt');

    if (search) {
      const searchTerms = search.toLowerCase().split(' ');
      posts = posts.filter(post => {
        const searchText = `${post.title} ${post.excerpt} ${post.tags.join(' ')}`.toLowerCase();
        return searchTerms.every(term => searchText.includes(term));
      });
    }

    // Get all tags if requested
    if (getTags) {
      const allTags = Array.from(new Set(posts.flatMap(post => post.tags)));
      const tagCounts = posts.reduce((acc: { [key: string]: number }, post) => {
        post.tags.forEach((tag: string) => {
          acc[tag] = (acc[tag] || 0) + 1;
        });
        return acc;
      }, {});

      return NextResponse.json({
        success: true,
        data: {
          posts,
          tags: allTags.map(tag => ({
            name: tag,
            count: tagCounts[tag] || 0,
          })),
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        posts
      }
    });
  } catch (error) {
    console.error('Error in blog API:', error);
    return new NextResponse(JSON.stringify({ 
      success: false,
      error: 'Internal Server Error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
