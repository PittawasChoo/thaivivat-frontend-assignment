import type { User } from "types/user";

export async function searchAccounts(q: string, signal?: AbortSignal): Promise<User[]> {
    const url = new URL("/api/search/accounts", window.location.origin);
    url.searchParams.set("q", q);

    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error("Search accounts failed");
    return res.json();
}
