export type Post = {
  id: string;
  username: string;
  caption: string;
  imageUrl: string;
  createdAt: string;
  likesCount: number;
};

export type PostsResponse = {
  data: Post[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
};
