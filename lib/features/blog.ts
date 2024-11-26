import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'data/blog');

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  coverImage?: string;
  excerpt: string;
  content: string;
  readingTime: number;
  tags: string[];
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = await Promise.all(
    fileNames
      .filter(fileName => fileName.endsWith('.md') && fileName !== 'template.md' && fileName !== 'README.md')
      .map(async (fileName) => {
        const slug = fileName.replace(/\.md$/, '');
        const post = await getPostBySlug(slug);
        return post;
      })
  );

  return allPostsData
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const processedContent = await remark()
      .use(html)
      .process(content);
    const contentHtml = processedContent.toString();

    const wordCount = content.split(/\s+/g).length;
    const readingTime = Math.ceil(wordCount / 200);

    return {
      slug,
      title: data.title,
      date: data.date.toISOString(),
      coverImage: data.coverImage,
      excerpt: data.excerpt || content.slice(0, 150) + '...',
      content: contentHtml,
      readingTime,
      tags: data.tags || [],
    };
  } catch (error) {
    return null;
  }
}

export async function getAllTags(): Promise<{ tag: string; count: number }[]> {
  const posts = await getAllPosts();
  const tagCounts = posts.reduce((acc, post) => {
    post.tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  return posts.filter(post => post.tags.includes(tag));
}

export async function searchPosts(query: string): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  const searchTerms = query.toLowerCase().split(' ');
  
  return posts.filter(post => {
    const searchText = `${post.title} ${post.excerpt} ${post.tags.join(' ')}`.toLowerCase();
    return searchTerms.every(term => searchText.includes(term));
  });
}
