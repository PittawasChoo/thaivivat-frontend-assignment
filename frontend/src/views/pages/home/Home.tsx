import { useCallback, useEffect, useRef } from "react";

import { likePost, unlikePost } from "apis/postsApi";
import FeedStatus from "components/feed-status/FeedStatus";
import PostBox from "components/post-box/PostBox";
import { useInfiniteObserver } from "hooks/useInfiniteObserver";
import { useInfinitePosts } from "hooks/useInfinitePosts";

import type { PostWithRelations } from "types/post";

import { FeedMain, Page, PostList, Sentinel, Spacer, Title } from "./Home.styles";

export default function Home() {
    const { posts, setPosts, isLoading, error, hasMore, loadMore } = useInfinitePosts({
        limit: 10,
    });

    const onIntersect = useCallback(() => {
        if (!isLoading && hasMore) loadMore();
    }, [isLoading, hasMore, loadMore]);

    const sentinelRef = useInfiniteObserver({
        enabled: hasMore,
        onIntersect,
        rootMargin: "1000px",
    });

    const postsRef = useRef<PostWithRelations[]>([]);
    useEffect(() => {
        postsRef.current = posts;
    }, [posts]);

    const inflightRef = useRef(new Map<string, AbortController>());

    const onToggleLike = useCallback(
        async (id: number) => {
            const postId = String(id);

            // cancel previous request for this post
            const prev = inflightRef.current.get(postId);
            if (prev) prev.abort();

            const controller = new AbortController();
            inflightRef.current.set(postId, controller);

            // read from ref (always latest)
            const snapshot = postsRef.current.find((p) => String(p.id) === postId);
            if (!snapshot) {
                inflightRef.current.delete(postId);
                return;
            }

            const nextLiked = !snapshot.liked;

            // optimistic update
            setPosts((curr) =>
                curr.map((p) => {
                    if (String(p.id) !== postId) return p;
                    const likesCount = Math.max(0, (p.likesCount ?? 0) + (nextLiked ? 1 : -1));
                    return { ...p, liked: nextLiked, likesCount };
                })
            );

            try {
                const data = nextLiked
                    ? await likePost(postId, controller.signal)
                    : await unlikePost(postId, controller.signal);

                // sync with server response
                setPosts((curr) =>
                    curr.map((p) =>
                        String(p.id) === postId
                            ? { ...p, liked: data.liked, likesCount: data.likesCount }
                            : p
                    )
                );
            } catch (e: any) {
                if (e?.name === "AbortError") return;

                // rollback
                setPosts((curr) => curr.map((p) => (String(p.id) === postId ? snapshot : p)));

                console.error(e);
            } finally {
                if (inflightRef.current.get(postId) === controller) {
                    inflightRef.current.delete(postId);
                }
            }
        },
        [setPosts]
    );

    return (
        <Page>
            <Title>Amstagrin</Title>

            <FeedMain>
                <PostList>
                    {posts.map((p) => (
                        <PostBox key={p.id} post={p} onToggleLike={onToggleLike} />
                    ))}
                </PostList>

                <FeedStatus
                    loading={isLoading}
                    error={error}
                    hasMore={hasMore}
                    hasAnyPosts={posts.length > 0}
                />

                {hasMore && <Spacer />}

                <Sentinel ref={sentinelRef} />
            </FeedMain>
        </Page>
    );
}
