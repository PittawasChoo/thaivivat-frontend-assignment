import { useCallback, useMemo } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { fetchPosts, likePost, unlikePost } from "apis/postsApi";
import FeedStatus from "components/feed-status/FeedStatus";
import PostBox from "components/post-box/PostBox";
import { useInfiniteObserver } from "hooks/useInfiniteObserver";

import type { PostsResponse, PostWithRelations } from "types/post";

const LIMIT = 10;

function postsKey(q: string) {
    return ["posts", { q, limit: LIMIT }] as const;
}

export default function Home() {
    const q = ""; // if you have search in feed later, put it here
    const queryClient = useQueryClient();

    const postsQuery = useInfiniteQuery<PostsResponse>({
        queryKey: postsKey(q),
        initialPageParam: 1,
        queryFn: ({ pageParam, signal }) =>
            fetchPosts({ page: pageParam as number, limit: LIMIT, q, signal }),
        getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
    });

    const posts = useMemo(
        () => postsQuery.data?.pages.flatMap((p) => p.data) ?? [],
        [postsQuery.data]
    );

    const hasMore = postsQuery.hasNextPage ?? false;
    const isLoading = postsQuery.isFetchingNextPage || postsQuery.isLoading;
    const error = postsQuery.isError
        ? (postsQuery.error as any)?.message ?? "Something went wrong"
        : null;

    const onIntersect = useCallback(() => {
        if (postsQuery.hasNextPage && !postsQuery.isFetchingNextPage) {
            void postsQuery.fetchNextPage();
        }
    }, [postsQuery]);

    const sentinelRef = useInfiniteObserver({
        enabled: hasMore,
        onIntersect,
        rootMargin: "1000px",
    });

    // --- Mutations (optimistic) ---
    const toggleLikeMutation = useMutation({
        mutationFn: async ({ postId, nextLiked }: { postId: string; nextLiked: boolean }) => {
            return nextLiked ? likePost(postId) : unlikePost(postId);
        },

        onMutate: async ({ postId, nextLiked }) => {
            await queryClient.cancelQueries({ queryKey: postsKey(q) });

            // const prev = queryClient.getQueryData<ReturnType<typeof postsQuery>["data"]>(
            //     postsKey(q)
            // );

            // query data shape is InfiniteData<PostsResponse> - we can treat it loosely
            const previousData = queryClient.getQueryData<any>(postsKey(q));

            // optimistic update
            queryClient.setQueryData<any>(postsKey(q), (old: any) => {
                if (!old) return old;

                return {
                    ...old,
                    pages: old.pages.map((page: PostsResponse) => ({
                        ...page,
                        data: page.data.map((p: PostWithRelations) => {
                            if (String(p.id) !== postId) return p;
                            const likesCount = Math.max(
                                0,
                                (p.likesCount ?? 0) + (nextLiked ? 1 : -1)
                            );
                            return { ...p, liked: nextLiked, likesCount };
                        }),
                    })),
                };
            });

            return { previousData };
        },

        onError: (_err, _vars, ctx) => {
            // rollback
            if (ctx?.previousData) queryClient.setQueryData(postsKey(q), ctx.previousData);
        },

        onSuccess: (data, vars) => {
            // sync canonical server response (optional but nice)
            queryClient.setQueryData<any>(postsKey(q), (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    pages: old.pages.map((page: PostsResponse) => ({
                        ...page,
                        data: page.data.map((p: PostWithRelations) =>
                            String(p.id) === vars.postId
                                ? { ...p, liked: data.liked, likesCount: data.likesCount }
                                : p
                        ),
                    })),
                };
            });
        },
    });

    const onToggleLike = useCallback(
        (id: number) => {
            const postId = String(id);

            // determine nextLiked from current cached data (stable)
            const current = posts.find((p) => String(p.id) === postId);
            if (!current) return;

            toggleLikeMutation.mutate({ postId, nextLiked: !current.liked });
        },
        [posts, toggleLikeMutation]
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

                {hasMore && <div style={{ height: 50 }} />}
                <div ref={sentinelRef} style={{ height: 1 }} />
            </main>
        </div>
    );
}
