import { useCallback, useRef } from "react";

import { likePost, unlikePost } from "apis/postsApi";

import FeedStatus from "components/feed-status/FeedStatus";
import PostBox from "components/post-box/PostBox";

import { useInfiniteObserver } from "hooks/useInfiniteObserver";
import { useInfinitePosts } from "hooks/useInfinitePosts";

export default function Home() {
    const { posts, setPosts, isLoading, error, hasMore, loadMore } = useInfinitePosts({
        limit: 10,
    });

    const onIntersect = useCallback(() => {
        if (!isLoading && hasMore) loadMore();
    }, [isLoading, hasMore, loadMore]);

    const sentinelRef = useInfiniteObserver({
        enabled: hasMore, // stop observing when no more
        onIntersect,
        rootMargin: "1000px",
    });

    const inflightRef = useRef(new Map<string, AbortController>());

    const onToggleLike = useCallback(
        async (id: number) => {
            const postId = String(id);
            // 1) cancel any previous request for this post (optional but recommended)
            const prev = inflightRef.current.get(postId);
            if (prev) prev.abort();

            const controller = new AbortController();
            inflightRef.current.set(postId, controller);

            // 2) snapshot previous post (for rollback)
            const prevPost = posts.find((p) => String(p.id) === postId);
            if (!prevPost) return;

            const nextLiked = !prevPost.liked;

            // 3) optimistic UI update (instant)
            setPosts((curr) =>
                curr.map((p) => {
                    if (String(p.id) !== postId) return p;
                    const likesCount = Math.max(0, (p.likesCount ?? 0) + (nextLiked ? 1 : -1));
                    return { ...p, liked: nextLiked, likesCount };
                })
            );

            try {
                // 4) send request
                const data = nextLiked
                    ? await likePost(postId, controller.signal)
                    : await unlikePost(postId, controller.signal);

                // 5) (optional) sync with server canonical response
                setPosts((curr) =>
                    curr.map((p) =>
                        String(p.id) === postId
                            ? { ...p, liked: data.liked, likesCount: data.likesCount }
                            : p
                    )
                );
            } catch (e: any) {
                // If aborted due to rapid toggling, ignore
                if (e?.name === "AbortError") return;

                // 6) rollback on failure
                setPosts((curr) => curr.map((p) => (String(p.id) === postId ? prevPost : p)));

                // Optional: toast/snackbar
                console.error(e);
            } finally {
                // 7) clear inflight if it's still the same controller
                if (inflightRef.current.get(postId) === controller) {
                    inflightRef.current.delete(postId);
                }
            }
        },
        [posts, setPosts]
    );

    return (
        <div>
            <h2 style={{ marginBottom: 12 }}>Amstagrin</h2>

            <main
                style={{
                    maxWidth: 468,
                    margin: "0 auto",
                    padding: 12,
                    display: "flex",
                    flexDirection: "column",
                    gap: "30px",
                }}
            >
                <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                    {posts.map((p) => (
                        <PostBox key={p.id} post={p} onToggleLike={onToggleLike} />
                    ))}
                </div>

                <FeedStatus
                    loading={isLoading}
                    error={error}
                    hasMore={hasMore}
                    hasAnyPosts={posts.length > 0}
                />

                {/* Sentinel at bottom */}
                {hasMore && (
                    <>
                        <div style={{ height: "50px" }} />
                    </>
                )}

                <div ref={sentinelRef} style={{ height: 1 }} />
            </main>
        </div>
    );
}
