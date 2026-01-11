export type SearchUser = {
    id: number;
    username: string;
    name: string;
    avatarUrl: string;
    isVerified?: boolean;
    hasStory: boolean;
    followersCount: number;
    followingsCount: number;
    postCount: number;
};

export async function searchAccounts(q: string, signal?: AbortSignal): Promise<SearchUser[]> {
    const url = new URL("/api/search/accounts", window.location.origin);
    url.searchParams.set("q", q);

    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error("Search accounts failed");
    return res.json();
}
