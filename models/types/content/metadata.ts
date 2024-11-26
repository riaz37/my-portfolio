export interface WithSlug {
  slug: string;
}

export interface WithViews {
  views: number;
}

export interface WithLikes {
  likes: number;
}

export interface WithPublishStatus {
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date;
}
