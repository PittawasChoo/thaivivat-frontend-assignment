export async function getUserByUsername(username: string, signal?: AbortSignal) {
    const res = await fetch(`/api/users/${encodeURIComponent(username)}`, { signal });
    if (!res.ok) throw new Error("Failed to load user");
    return res.json();
}
