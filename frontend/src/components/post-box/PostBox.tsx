import React, { useEffect, useMemo, useRef, useState } from "react";
import SmartImage from "../smart-image/SmartImage";
import type { PostWithRelations } from "../../types/post";
import RightArrow from "../../assets/icons/right-arrow.png";
import LeftArrow from "../../assets/icons/left-arrow.png";
import Verified from "../../assets/icons/verified.png";
import Heart from "../../assets/icons/heart-outline.png";
import RedHeart from "../../assets/icons/heart-red.png";
import User from "../../assets/icons/user.png";

/* image size cache */
const sizeCache = new Map<string, { w: number; h: number }>();
const loadImageSize = (src: string) =>
    new Promise<{ w: number; h: number }>((res, rej) => {
        const cached = sizeCache.get(src);
        if (cached) return res(cached);
        const img = new Image();
        img.onload = () => {
            const val = { w: img.naturalWidth, h: img.naturalHeight };
            sizeCache.set(src, val);
            res(val);
        };
        img.onerror = rej;
        img.src = src;
    });

export default function PostBox(props: { post: PostWithRelations }) {
    const { post } = props;
    const urls = post.imageUrls ?? [];

    const defaultTagsState = useMemo(() => urls.map(() => false), [urls.length]);
    const [showingTags, setShowingTags] = useState(defaultTagsState);

    useEffect(() => {
        // reset when post changes (or number of images changes)
        setShowingTags(defaultTagsState);
    }, [post.id, defaultTagsState]);

    const resetTags = () => setShowingTags(defaultTagsState);

    const toggleShowTags = (imageIndex: number) => {
        setShowingTags((prev) => prev.map((isOpen, i) => (i === imageIndex ? !isOpen : false)));
    };

    const hasMultiple = urls.length > 1;

    const [activeImage, setActiveImage] = useState(0);
    useEffect(() => setActiveImage(0), [post.id]);

    /** container width */
    const containerRef = useRef<HTMLDivElement | null>(null);

    /** load image sizes */
    const [sizes, setSizes] = useState<{ w: number; h: number }[]>([]);
    useEffect(() => {
        let cancel = false;
        Promise.all(urls.map(loadImageSize))
            .then((r) => !cancel && setSizes(r))
            .catch(() => {});
        return () => {
            cancel = true;
        };
    }, [urls]);

    const height = useMemo(() => {
        const hasPortrait = sizes.some((s) => s.h > s.w);
        return hasPortrait ? 650 : 468;
    }, [sizes]);

    const isPortraitByIndex = useMemo(() => {
        return sizes.map((s) => s.h > s.w);
    }, [sizes]);

    return (
        <div style={styles.card}>
            <div
                style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    padding: 10,
                    gap: 12,
                }}
            >
                <div
                    style={{
                        ...styles.profileImgContainer,
                        ...(post.user?.hasStory ? styles.hasStory : {}),
                    }}
                >
                    <img
                        style={styles.profileImg}
                        src={post.user?.avatarUrl}
                        alt=""
                        aria-hidden="true"
                    />
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={styles.user}>{post.user?.username}</span>
                        {post.user?.isVerified && (
                            <img
                                style={styles.verified}
                                src={Verified}
                                alt="Verified Account"
                                aria-hidden="true"
                            />
                        )}
                    </div>
                    {post.location?.name && (
                        <span style={{ fontSize: 12 }}>{post.location.name}</span>
                    )}
                </div>
            </div>

            <div ref={containerRef} style={{ ...styles.imageContainer, height }}>
                <div
                    style={{
                        display: "flex",
                        height: "100%",
                        transform: `translateX(-${activeImage * 100}%)`,
                        transition: "transform 300ms ease",
                    }}
                >
                    {urls.map((src, i) => {
                        const isPortrait = isPortraitByIndex[i] ?? false; // fallback while sizes loading
                        const tags = post.allTags?.[i] ?? [];

                        return (
                            <div
                                key={src}
                                style={{ flex: "0 0 100%", height: "100%", position: "relative" }}
                            >
                                <SmartImage
                                    src={src}
                                    alt={post.caption}
                                    style={{
                                        ...styles.image,
                                        objectFit: isPortrait ? "cover" : "contain",
                                        objectPosition: isPortrait ? "center" : "center",
                                    }}
                                    onClick={() => toggleShowTags(i)}
                                    onDoubleClick={() => console.log("double click:", post.id, i)}
                                />

                                {tags.length > 0 && (
                                    <div
                                        style={{
                                            width: "28px",
                                            height: "28px",
                                            backgroundColor: "rgba(43, 48, 54, 0.6)",
                                            position: "absolute",
                                            bottom: 20,
                                            left: 20,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            borderRadius: "50%",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => toggleShowTags(i)}
                                    >
                                        <img
                                            style={{ width: 11, height: 11 }}
                                            src={User}
                                            alt="Toggle Tags"
                                            aria-hidden="true"
                                        />
                                    </div>
                                )}

                                {showingTags[i] && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: "50%",
                                            left: "50%",
                                            transform: "translate(-50%, -50%)",
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            gap: 10,
                                        }}
                                    >
                                        {tags.map((tag) => (
                                            <div
                                                style={{
                                                    padding: "6px 15px",
                                                    borderRadius: 16,
                                                    background: "rgba(43, 48, 54, 0.6)",
                                                    color: "#fff",
                                                    fontSize: 14,
                                                    fontWeight: 800,
                                                    pointerEvents: "none",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                {tag}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* controls */}
                {hasMultiple && (
                    <>
                        {activeImage > 0 && (
                            <button
                                style={{ ...styles.carouselBtn, left: 10 }}
                                onClick={() => {
                                    resetTags();
                                    setActiveImage((i) => i - 1);
                                }}
                            >
                                <img
                                    style={styles.icon}
                                    src={LeftArrow}
                                    alt=""
                                    aria-hidden="true"
                                />
                            </button>
                        )}
                        {activeImage < urls.length - 1 && (
                            <button
                                style={{ ...styles.carouselBtn, right: 10 }}
                                onClick={() => {
                                    resetTags();
                                    setActiveImage((i) => i + 1);
                                }}
                            >
                                <img
                                    style={styles.icon}
                                    src={RightArrow}
                                    alt=""
                                    aria-hidden="true"
                                />
                            </button>
                        )}

                        <div style={styles.dots}>
                            {urls.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveImage(i)}
                                    style={{
                                        ...styles.dot,
                                        opacity: i === activeImage ? 0.9 : 0.35,
                                    }}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            <div style={styles.actions}>
                <div onClick={() => console.log("Like clicked:", post.id)}>
                    <img
                        style={{ width: 24, height: 24 }}
                        src={post.liked ? RedHeart : Heart}
                        alt=""
                        aria-hidden="true"
                    />
                </div>
                <span>{post.likesCount} likes</span>
            </div>

            <div style={styles.caption}>{post.caption}</div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    card: { background: "#0c1013" },

    profileImgContainer: {
        width: 56,
        height: 56,
        borderRadius: "50%",
        overflow: "hidden",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    hasStory: {
        backgroundImage:
            "linear-gradient(45deg, #ffa95f 5%, #f47838 15%, #d92d7a 70%, #962fbf 80%, #4f5bd5 95%)",
    },
    profileImg: {
        width: 44,
        height: 44,
        borderRadius: "50%",
        border: "4px solid #0c1013",
        objectFit: "cover",
    },
    user: { fontSize: 16, fontWeight: 800 },
    verified: {
        width: 18,
        height: 18,
    },

    imageContainer: {
        position: "relative",
        width: "100%",
        overflow: "hidden",
        borderRadius: 10,
        border: "1px solid rgba(200,200,200,0.3)",
    },

    image: {
        width: "100%",
        height: "100%",
        display: "block",
        cursor: "pointer",
        objectFit: "cover", // ✅ fill + crop
        objectPosition: "center", // crop from center
    },
    carouselBtn: {
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        width: 30,
        height: 30,
        borderRadius: "50%",
        border: "1px solid rgba(255,255,255,0.15)",
        background: "#e4e9e8",
        color: "#000",
        cursor: "pointer",
        fontSize: 22,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
    },
    icon: { width: 12, height: 12 },

    dots: {
        position: "absolute",
        bottom: 10,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        gap: 6,
    },

    dot: {
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        background: "#fff",
        cursor: "pointer",
        border: "1px solid rgba(0,0,0,0.35)",
        boxShadow: "0 2px 6px rgba(0,0,0,0.35)",
        padding: 0,
    },

    actions: { padding: 10, display: "flex", gap: 10 },
    caption: { padding: "0 10px 10px" },
};
