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

      {/* {posts.map((p) => (
        <article
          key={p.id}
          style={{
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12,
            padding: 12,
            marginBottom: 12,
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 6 }}>{p.username}</div>
          <img
            src={p.imageUrl}
            alt={p.caption}
            style={{ width: "100%", borderRadius: 10, display: "block" }}
            loading="lazy"
          />
          <div style={{ marginTop: 8 }}>{p.caption}</div>
          <div style={{ opacity: 0.7, fontSize: 12, marginTop: 6 }}>
            ❤️ {p.likesCount} • {new Date(p.createdAt).toLocaleString()}
          </div>
        </article>
      ))} */}

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

        {/* Sentinel at bottom */}
        <div style={{ height: 16 }} />
        <div ref={sentinelRef} style={{ height: 1 }} />

        <FeedStatus
          loading={isLoading}
          error={error}
          hasMore={!hasMore && !isLoading}
          hasAnyPosts={posts.length > 0}
        />
      </main>
    </div>
  );
}
