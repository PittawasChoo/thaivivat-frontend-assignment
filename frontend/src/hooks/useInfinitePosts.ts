import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchPosts } from "../apis/postsApi";

import type { PostWithRelations } from "../types/post";

type UseInfinitePostsArgs = {
    limit?: number;
    q?: string;
};

export function useInfinitePosts({ limit = 10, q = "" }: UseInfinitePostsArgs) {
    const [posts, setPosts] = useState<PostWithRelations[]>([]);
    const [page, setPage] = useState(0); // 0 = not loaded yet
    const [hasMore, setHasMore] = useState(true);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const abortRef = useRef<AbortController | null>(null);
    const inFlightRef = useRef(false);

    const canLoadMore = useMemo(
        () => hasMore && !isLoading && !inFlightRef.current,
        [hasMore, isLoading]
    );

    const fetchPage = useCallback(
        async (nextPage: number, modeForMerge: "replace" | "append") => {
            if (inFlightRef.current) return;
            inFlightRef.current = true;

            setIsLoading(true);
            setError(null);

            try {
                const res = await fetchPosts({
                    page: nextPage,
                    limit,
                    q,
                    signal: abortRef.current?.signal,
                });

                setPosts((prev) =>
                    modeForMerge === "replace" ? res.data : [...prev, ...res.data]
                );
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

    const loadMore = useCallback(() => {
        if (!canLoadMore) return;
        const nextPage = page + 1;
        void fetchPage(nextPage, "append");
    }, [canLoadMore, fetchPage, page]);

    const reset = useCallback(() => {
        abortRef.current?.abort();
        abortRef.current = new AbortController();

        setPosts([]);
        setPage(0);
        setHasMore(true);

        void fetchPage(1, "replace");
    }, [fetchPage]);

    // initial load + when q/limit changes
    useEffect(() => {
        reset();
        return () => abortRef.current?.abort();
    }, [reset]);

    return { posts, isLoading, error, hasMore, loadMore, reset, page };
}
