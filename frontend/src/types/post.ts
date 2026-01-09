export type PostsResponse = {
    data: PostWithRelations[];
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
};

export type User = {
    id: number;
    username: string;
    name: string;
    avatarUrl: string;
    isVerified: boolean;
    hasStory: boolean;
};

export type Location = {
    id: number;
    name: string;
};

export type Post = {
    id: number;
    userId: number;
    locationId: number | null;
    imageUrls: string[];
    createdAt: string;
    allTags: string[][];
    likesCount: number;
    caption: string;
    liked: boolean;
};

export type PostWithRelations = Post & {
    user: User;
    location: Location | null;
};
