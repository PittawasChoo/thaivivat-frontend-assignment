import type { Location } from "./location";
import type { User } from "./user";

export type Post = {
    allTags: string[][];
    caption: string;
    createdAt: string;
    id: number;
    imageUrls: string[];
    liked: boolean;
    likesCount: number;
    locationId: number | null;
    userId: number;
};

export type PostsResponse = {
    data: PostWithRelations[];
    hasMore: boolean;
    limit: number;
    page: number;
    total: number;
};

export type PostWithRelations = Post & {
    location: Location | null;
    user: User;
};
