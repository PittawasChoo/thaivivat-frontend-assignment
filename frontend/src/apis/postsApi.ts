import type { PostsResponse } from "types/post";

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const baseURL = new URL("http://localhost:4000"); // This should be stored in an environment variable in production

export async function fetchPosts(params: {
    page: number;
    limit: number;
    q: string;
    signal?: AbortSignal;
}): Promise<PostsResponse> {
    const { page, limit, q = "", signal } = params;

    const url = new URL(baseURL + "api/posts");
    url.searchParams.set("page", String(page));
    url.searchParams.set("limit", String(limit));
    if (q) url.searchParams.set("q", q);

    const res = await fetch(url.toString(), { signal });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Failed to fetch posts (${res.status}): ${text || res.statusText}`);
    }

    return (await res.json()) as PostsResponse;
}

export async function likePost(postId: string | number, signal?: AbortSignal) {
    const res = await fetch(`/api/posts/${postId}/like`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        signal,
    });
    if (!res.ok) throw new Error("Like failed");
    return res.json() as Promise<{ postId: number; liked: boolean; likesCount: number }>;
}

export async function unlikePost(postId: string | number, signal?: AbortSignal) {
    const res = await fetch(`/api/posts/${postId}/unlike`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        signal,
    });
    if (!res.ok) throw new Error("Unlike failed");
    return res.json() as Promise<{ postId: number; liked: boolean; likesCount: number }>;
}

export async function getPostsByUserUsername(username: string, signal?: AbortSignal) {
    const res = await fetch(`/api/user-posts/${encodeURIComponent(username)}`, { signal });
    if (!res.ok) throw new Error("Failed to load posts");
    return res.json();
}
