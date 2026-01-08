import React from "react";
import SmartImage from "../smart-image/SmartImage";
import type { Post } from "../../types/post";

const PostBox = (props: {
  post: Post;
  onOpen: (p: Post) => void;
  onLike: (id: string) => void;
  onDoubleLike: (id: string) => void;
}) => {
  const { post, onOpen, onLike, onDoubleLike } = props;

  return (
    <div style={styles.card}>
      <div style={styles.user}>{post.username}</div>

      <SmartImage
        src={post.imageUrl}
        alt={post.caption}
        style={styles.image}
        onClick={() => onOpen(post)}
        onDoubleClick={() => onDoubleLike(post.id)}
      />

      <div style={styles.actions}>
        <button onClick={() => onLike(post.id)}>❤️</button>
        <span>{post.likesCount} likes</span>
      </div>

      <div style={styles.caption}>{post.caption}</div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: "#202020",
    border: "1px solid #ddd",
    borderRadius: 10,
    overflow: "hidden",
  },
  user: { padding: 10, fontWeight: 600 },
  image: { width: "100%", display: "block", cursor: "pointer" },
  actions: { padding: 10, display: "flex", gap: 10 },
  caption: { padding: "0 10px 10px" },
};

export default PostBox;
