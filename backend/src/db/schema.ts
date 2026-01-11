export type ID = number;

export type User = {
    id: ID;
    username: string;
    name?: string;
    avatarUrl?: string;
    isVerified?: boolean;
    hasStory?: boolean;
    followersCount?: number;
    followingsCount?: number;
};

export type Location = {
    id: ID;
    name: string;
};

export type Post = {
    id: ID;
    userId: ID;
    caption?: string;
    imageUrl?: string;
    createdAt: string;
    locationId?: ID | null;

    likesCount?: number;
    liked?: boolean;
};

export type DbSchema = {
    posts: Post[];
    users: User[];
    locations: Location[];
};

export type PostFeedItem = Post & {
    user: (User & { postsCount: number }) | null;
    location: Location | null;
};
