import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchPosts } from "../apis/postsApi";
import type { Post } from "../types/post";

type UseInfinitePostsArgs = {
  limit?: number;
  q?: string;
};

export function useInfinitePosts({ limit = 10, q = "" }: UseInfinitePostsArgs) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const canLoadMore = useMemo(
    () => hasMore && !isLoading,
    [hasMore, isLoading]
  );

  const fetchPage = useCallback(
    async (nextPage: number, mode: "replace" | "append") => {
      // cancel previous request
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsLoading(true);
      setError(null);

      try {
        const res = await fetchPosts({
          page: nextPage,
          limit,
          q,
          signal: controller.signal,
        });

        setPosts((prev) =>
          mode === "replace" ? res.data : [...prev, ...res.data]
        );
        setPage(res.page);
        setHasMore(res.hasMore);
      } catch (e: any) {
        // ignore abort errors
        if (e?.name !== "AbortError")
          setError(e?.message ?? "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    },
    [limit, q]
  );

  const loadMore = useCallback(() => {
    if (!canLoadMore) return;
    void fetchPage(page + 1, "append");
  }, [canLoadMore, fetchPage, page]);

  const reset = useCallback(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    void fetchPage(1, "replace");
  }, [fetchPage]);

  // initial load + when q/limit changes
  useEffect(() => {
    reset();
    return () => abortRef.current?.abort();
  }, [reset]);

  return { posts, isLoading, error, hasMore, loadMore, reset };
}
