import { useCallback, useEffect, useRef, useState } from "react";

import { fetchPosts } from "apis/postsApi";

import type { PostWithRelations } from "types/post";

type UseInfinitePostsArgs = {
    limit?: number;
    q?: string;
};

export function useInfinitePosts({ limit = 10, q = "" }: UseInfinitePostsArgs) {
    const [posts, setPosts] = useState<PostWithRelations[]>([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const abortRef = useRef<AbortController | null>(null);
    const inFlightRef = useRef(false);

    const startRequest = () => {
        // abort previous request
        abortRef.current?.abort();
        abortRef.current = new AbortController();
        return abortRef.current;
    };

    const fetchPage = useCallback(
        async (nextPage: number, mode: "replace" | "append") => {
            if (inFlightRef.current) return;
            inFlightRef.current = true;

            setIsLoading(true);
            setError(null);

            const ac = startRequest();

            try {
                const res = await fetchPosts({
                    page: nextPage,
                    limit,
                    q,
                    signal: ac.signal,
                });

                setPosts((prev) => (mode === "replace" ? res.data : [...prev, ...res.data]));
                setPage(res.page);
                setHasMore(res.hasMore);
            } catch (e: any) {
                if (e?.name !== "AbortError") {
                    setError(e?.message ?? "Something went wrong");
                }
            } finally {
                inFlightRef.current = false;
                setIsLoading(false);
            }
        },
        [limit, q]
    );

    const reset = useCallback(() => {
        setPosts([]);
        setPage(0);
        setHasMore(true);
        void fetchPage(1, "replace");
    }, [fetchPage]);

    const loadMore = useCallback(() => {
        if (inFlightRef.current) return;
        if (isLoading) return;
        if (!hasMore) return;

        const nextPage = page + 1;
        void fetchPage(nextPage, "append");
    }, [fetchPage, hasMore, isLoading, page]);

    // initial load + whenever q/limit changes
    useEffect(() => {
        reset();
        return () => abortRef.current?.abort();
    }, [reset]);

    return { posts, setPosts, page, hasMore, isLoading, error, loadMore, reset };
}
