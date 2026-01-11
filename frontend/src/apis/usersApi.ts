import type { User } from "types/user";
import type { Post } from "types/post";

export async function getUserByUsername(username: string, signal?: AbortSignal): Promise<User> {
    const res = await fetch(`/api/users/${encodeURIComponent(username)}`, { signal });
    if (!res.ok) throw new Error("Failed to load user");
    return res.json() as Promise<User>;
}

export async function getPostsByUserUsername(
    username: string,
    signal?: AbortSignal
): Promise<Post[]> {
    const res = await fetch(`/api/user-posts/${encodeURIComponent(username)}`, { signal });
    if (!res.ok) throw new Error("Failed to load posts");
    return res.json() as Promise<Post[]>;
}
