export interface Author {
  id: string;
  name: string;
  avatar: string;
  bio?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: Author;
  publishedAt: string;
  tags: string[];
  readingTime?: string;
}

export interface BlogResponse {
  blogs: BlogPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNextPage: boolean;
  };
}

export interface BlogQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  tag?: string;
  sort?: 'newest' | 'oldest' | 'popular';
}
