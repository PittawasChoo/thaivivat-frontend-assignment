import type { PostsResponse } from "../types/post";

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function fetchPosts(params: {
    page: number;
    limit: number;
    q: string;
    signal?: AbortSignal;
}): Promise<PostsResponse> {
    const { page, limit, q = "", signal } = params;

    const url = new URL("http://localhost:4000/api/posts"); // This should be stored in an environment variable in production
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
