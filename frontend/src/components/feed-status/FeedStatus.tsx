import React from "react";

const FeedStatus = (props: {
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  hasAnyPosts: boolean;
}) => {
  const { loading, error, hasMore, hasAnyPosts } = props;

  return (
    <>
      {error && <div style={styles.error}>{error}</div>}
      {!hasMore && hasAnyPosts && <div style={styles.info}>No more posts</div>}
      {loading && <div style={styles.info}>Loading…</div>}
    </>
  );
};

const styles: Record<string, React.CSSProperties> = {
  info: { textAlign: "center", opacity: 0.6, padding: "10px 0" },
  error: { color: "red", textAlign: "center", padding: "10px 0" },
};

export default FeedStatus;
