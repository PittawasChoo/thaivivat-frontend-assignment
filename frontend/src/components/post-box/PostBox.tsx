import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Heart from "assets/icons/heart-outline.png";
import LeftArrow from "assets/icons/left-arrow.png";
import RedHeart from "assets/icons/heart-red.png";
import RightArrow from "assets/icons/right-arrow.png";
import User from "assets/icons/user.png";
import Verified from "assets/icons/verified.png";

import type { PostWithRelations } from "types/post";

import { formatPostTime } from "utils/time";
import { formatToShortNumber } from "utils/number";

import SmartImage from "../smart-image/SmartImage";

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

export default function PostBox(props: {
    post: PostWithRelations;
    onToggleLike: (postId: number) => void;
}) {
    const { post, onToggleLike } = props;
    const urls = post.imageUrls ?? [];

    const hasMultiple = urls.length > 1;

    const [activeImage, setActiveImage] = useState(0);
    useEffect(() => setActiveImage(0), [post.id]);

    const [openTagsIndex, setOpenTagsIndex] = useState<number | null>(null);

    useEffect(() => setOpenTagsIndex(null), [post.id, activeImage]);

    const resetTags = () => setOpenTagsIndex(null);

    const toggleShowTags = (imageIndex: number) => {
        setOpenTagsIndex((prev) => (prev === imageIndex ? null : imageIndex));
    };

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

    const [likePulse, setLikePulse] = useState(false);
    const prevLikedRef = useRef(post.liked);

    useEffect(() => {
        const prev = prevLikedRef.current;
        prevLikedRef.current = post.liked;

        if (!prev && post.liked) {
            setLikePulse(true);
            const t = window.setTimeout(() => setLikePulse(false), 3000);
            return () => window.clearTimeout(t);
        }
    }, [post.liked]);

    return (
        <div style={styles.card}>
            <div
                style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    padding: "0 12px 12px 12px",
                    gap: 12,
                }}
            >
                <div
                    style={{
                        ...styles.profileImgContainer,
                        ...(post.user.hasStory ? styles.hasStory : {}),
                    }}
                >
                    <img
                        style={styles.profileImg}
                        src={post.user.avatarUrl}
                        alt=""
                        aria-hidden="true"
                    />
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
                    <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                        <span style={styles.user}>{post.user.username}</span>
                        {post.user.isVerified && (
                            <img
                                style={styles.verified}
                                src={Verified}
                                alt="Verified Account"
                                aria-hidden="true"
                            />
                        )}
                        {post.createdAt && (
                            <div
                                style={{
                                    display: "flex",
                                    gap: 5,
                                    alignItems: "center",
                                    fontSize: 16,
                                    color: "#a8a8a8",
                                }}
                            >
                                <span>•</span>
                                <span>{formatPostTime(post.createdAt)}</span>
                            </div>
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
                                style={{
                                    flex: "0 0 100%",
                                    height: "100%",
                                    position: "relative",
                                }}
                            >
                                <AnimatePresence mode="wait">
                                    {likePulse && i === activeImage && (
                                        <motion.div
                                            key={`heart-${post.id}-${activeImage}`}
                                            initial={{ opacity: 0, scale: 0.85 }}
                                            animate={{ opacity: 1, scale: 1.1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.35, ease: "easeOut" }}
                                            style={{
                                                position: "absolute",
                                                inset: 0,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                pointerEvents: "none",
                                                zIndex: 10,
                                                filter: "drop-shadow(0 10px 25px rgba(0,0,0,0.45))",
                                            }}
                                        >
                                            <motion.img
                                                src={RedHeart}
                                                alt=""
                                                aria-hidden="true"
                                                style={{ width: 200, height: 200 }}
                                                animate={{
                                                    scale: [1, 1.05, 1],
                                                    opacity: [1, 1, 0],
                                                }}
                                                transition={{ duration: 1.0, times: [0, 0.3, 1] }}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <SmartImage
                                    src={src}
                                    alt={post.caption}
                                    style={{
                                        ...styles.image,
                                        objectFit: isPortrait ? "cover" : "contain",
                                        objectPosition: isPortrait ? "center" : "center",
                                    }}
                                    onClick={() => toggleShowTags(i)}
                                    onDoubleClick={() => onToggleLike(post.id)}
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
                                <AnimatePresence mode="wait">
                                    {openTagsIndex === i && tags.length > 0 && (
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: "50%",
                                                left: "50%",
                                                transform: "translate(-50%, -50%)",
                                                zIndex: 6,
                                            }}
                                            onClick={resetTags}
                                        >
                                            <motion.div
                                                key={`tags-${post.id}-${i}`}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ duration: 0.2 }}
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    gap: 10,
                                                }}
                                            >
                                                {tags.map((tag) => (
                                                    <motion.div
                                                        key={tag}
                                                        initial={{ y: 6, opacity: 0 }}
                                                        animate={{ y: 0, opacity: 1 }}
                                                        exit={{ y: 6, opacity: 0 }}
                                                        transition={{ duration: 0.2 }}
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
                                                    </motion.div>
                                                ))}
                                            </motion.div>
                                        </div>
                                    )}
                                </AnimatePresence>
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
                <div onClick={() => onToggleLike(post.id)}>
                    <img
                        style={{ width: 24, height: 24, cursor: "pointer" }}
                        src={post.liked ? RedHeart : Heart}
                        alt=""
                        aria-hidden="true"
                    />
                </div>
                <span>{formatToShortNumber(post.likesCount)} likes</span>
            </div>

            <div style={styles.captionContainer}>
                <div style={styles.user}>{post.user.username}</div>
                {post.user.isVerified && (
                    <img
                        style={styles.verified}
                        src={Verified}
                        alt="Verified Account"
                        aria-hidden="true"
                    />
                )}
                <div>{post.caption}</div>
            </div>
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
        width: 16,
        height: 16,
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

    actions: {
        padding: "0px 12px",
        display: "flex",
        gap: 10,
        margin: "16px 0 0 0",
        fontSize: 16,
        fontWeight: 800,
    },
    captionContainer: {
        padding: "0px 12px",
        display: "flex",
        alignItems: "center",
        gap: 5,
        fontSize: 16,
    },
};
