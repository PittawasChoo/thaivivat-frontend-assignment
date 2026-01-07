import { useEffect, useRef, useState } from "react";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type Post = {
    id: string;
    username: string;
    caption: string;
    imageUrl: string;
    createdAt: string;
    likes: number;
};

type ApiResponse = {
    data: Post[];
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
};

async function getPosts(page: number, limit: number, q: string) {
    const url = new URL("/api/posts", window.location.origin);
    url.searchParams.set("page", String(page));
    url.searchParams.set("limit", String(limit));
    if (q) url.searchParams.set("q", q);

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error("Failed to fetch posts");
    return (await res.json()) as ApiResponse;
}

async function likePost(id: string) {
    const res = await fetch(`/api/posts/${id}/like`, { method: "PATCH" });
    if (!res.ok) throw new Error("Failed to like post");
    return (await res.json()) as Post;
}

type LoadMode = "PREFETCH" | "BOTTOM";

export default function MainPage() {
    const LIMIT = 10;

    const [posts, setPosts] = useState<Post[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [search, setSearch] = useState("");
    const [query, setQuery] = useState("");

    const [selected, setSelected] = useState<Post | null>(null);
    const [showHeart, setShowHeart] = useState(false);

    // ✅ toggle mode
    const [mode, setMode] = useState<LoadMode>("PREFETCH");

    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const didMountRef = useRef(false);

    /* Debounce search -> query (skip initial mount) */
    useEffect(() => {
        if (!didMountRef.current) {
            didMountRef.current = true;
            return;
        }

        const t = setTimeout(() => setQuery(search.trim()), 350);
        return () => clearTimeout(t);
    }, [search]);

    /* Reset feed when query changes */
    useEffect(() => {
        setPosts([]);
        setPage(1);
        setHasMore(true);
    }, [query]);

    /* Fetch posts */
    useEffect(() => {
        let cancelled = false;

        async function load() {
            if (!hasMore) return;
            if (loading) return;

            setLoading(true);
            setError(null);

            try {
                if (mode === "BOTTOM") {
                    await sleep(2000);
                }

                const res = await getPosts(page, LIMIT, query);
                if (cancelled) return;

                setPosts((prev) => [...prev, ...res.data]);
                setHasMore(res.hasMore);
            } catch (e) {
                if (!cancelled) setError(e instanceof Error ? e.message : "Unknown error");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [page, query]); // keep simple deps

    /* Infinite scroll observer (rebuild when mode changes) */
    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;

        // Mode configuration
        const options: IntersectionObserverInit =
            mode === "PREFETCH"
                ? { rootMargin: "400px", threshold: 0 } // load before bottom
                : { rootMargin: "0px", threshold: 1.0 }; // load only at bottom

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && hasMore && !loading) {
                setPage((p) => p + 1);
            }
        }, options);

        observer.observe(el);
        return () => observer.disconnect();
    }, [mode, hasMore, loading]);

    async function handleLike(id: string) {
        const updated = await likePost(id);
        setPosts((prev) => prev.map((p) => (p.id === id ? updated : p)));
        if (selected?.id === id) setSelected(updated);
    }

    return (
        <div style={styles.page}>
            <header style={styles.header}>
                <strong>Instaclone</strong>

                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    style={styles.search}
                />

                <button
                    type="button"
                    style={styles.modeBtn}
                    onClick={() => setMode((m) => (m === "PREFETCH" ? "BOTTOM" : "PREFETCH"))}
                    title="Toggle infinite scroll mode"
                >
                    {mode === "PREFETCH" ? "Mode: Prefetch" : "Mode: Bottom"}
                </button>
            </header>

            <main style={styles.feed}>
                {posts.map((p) => (
                    <div key={p.id} style={styles.card}>
                        <div style={styles.user}>{p.username}</div>

                        <img
                            src={p.imageUrl}
                            alt={p.caption}
                            style={styles.image}
                            onClick={() => setSelected(p)}
                            onDoubleClick={() => {
                                setShowHeart(true);
                                handleLike(p.id);
                                setTimeout(() => setShowHeart(false), 500);
                            }}
                        />

                        <div style={styles.actions}>
                            <button onClick={() => handleLike(p.id)}>❤️</button>
                            <span>{p.likes} likes</span>
                        </div>

                        <div style={styles.caption}>{p.caption}</div>
                    </div>
                ))}

                {error && <div style={styles.error}>{error}</div>}
                {!hasMore && posts.length > 0 && <div style={styles.info}>No more posts</div>}

                {/* Sentinel at bottom */}
                <div style={{ height: 16 }} />
                <div ref={sentinelRef} style={{ height: 1 }} />

                {/* Loader at bottom */}
                {loading && <div style={styles.info}>Loading…</div>}
            </main>

            {selected && (
                <div style={styles.modalOverlay} onClick={() => setSelected(null)}>
                    <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <img src={selected.imageUrl} style={styles.modalImage} />
                        {showHeart && <div style={styles.heart}>❤️</div>}
                        <p>{selected.caption}</p>
                        <button onClick={() => handleLike(selected.id)}>Like</button>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    page: { background: "#fafafa", minHeight: "100vh" },
    header: {
        position: "sticky",
        top: 0,
        background: "#fff",
        padding: 12,
        display: "flex",
        gap: 12,
        alignItems: "center",
        borderBottom: "1px solid #ddd",
    },
    search: { flex: 1, padding: 8, borderRadius: 8, border: "1px solid #ccc" },
    modeBtn: {
        padding: "8px 10px",
        borderRadius: 10,
        border: "1px solid #ddd",
        background: "#fff",
        cursor: "pointer",
        fontWeight: 700,
        fontSize: 12,
    },
    feed: {
        maxWidth: 500,
        margin: "0 auto",
        padding: 12,
        display: "flex",
        flexDirection: "column",
        gap: 16,
    },
    card: { background: "#fff", border: "1px solid #ddd", borderRadius: 10, overflow: "hidden" },
    user: { padding: 10, fontWeight: 600 },
    image: { width: "100%", display: "block", cursor: "pointer" },
    actions: { padding: 10, display: "flex", gap: 10 },
    caption: { padding: "0 10px 10px" },
    info: { textAlign: "center", opacity: 0.6 },
    error: { color: "red", textAlign: "center" },

    modalOverlay: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "grid",
        placeItems: "center",
    },
    modal: {
        background: "#fff",
        padding: 16,
        borderRadius: 12,
        position: "relative",
        maxWidth: 500,
    },
    modalImage: { width: "100%" },
    heart: { position: "absolute", inset: 0, display: "grid", placeItems: "center", fontSize: 80 },
};
