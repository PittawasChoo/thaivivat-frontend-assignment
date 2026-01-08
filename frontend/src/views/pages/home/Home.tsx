import { useCallback } from "react";
import { useInfinitePosts } from "../../../hooks/useInfinitePosts";
import { useInfiniteObserver } from "../../../hooks/useInfiniteObserver";
import PostBox from "../../../components/post-box/PostBox";
import FeedStatus from "../../../components/feed-status/FeedStatus";

export default function Home() {
  const { posts, isLoading, error, hasMore, loadMore } = useInfinitePosts({
    limit: 10,
  });

  const onIntersect = useCallback(() => {
    if (!isLoading && hasMore) loadMore();
  }, [isLoading, hasMore, loadMore]);

  const sentinelRef = useInfiniteObserver({
    enabled: hasMore, // stop observing when no more
    onIntersect,
    rootMargin: "600px",
  });

  return (
    <div>
      <h2 style={{ marginBottom: 12 }}>Home</h2>

      <main
        style={{
          maxWidth: 500,
          margin: "0 auto",
          padding: 12,
          display: "flex",
          flexDirection: "column",
          gap: "30px",
        }}
      >
        {posts.map((p) => (
          <PostBox
            key={p.id}
            post={p}
            onOpen={() => {}}
            onLike={() => {}}
            onDoubleLike={() => {}}
          />
        ))}

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
