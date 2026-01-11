import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Verified from "assets/icons/verified.png";
import { getUserByUsername } from "apis/usersApi";
import { getPostsByUserUsername } from "apis/postsApi";
import { formatToShortNumber } from "utils/number";
import ProfileImage from "components/profile-image/ProfileImage";

import type { User } from "types/user";
import type { Post } from "types/post";

export default function Profile() {
    const { username = "" } = useParams();
    console.log("Profile page for username:", username);

    const [user, setUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!username) return;

        const ac = new AbortController();
        setLoading(true);
        setError(null);

        (async () => {
            try {
                const u = await getUserByUsername(username, ac.signal);
                const p = await getPostsByUserUsername(username, ac.signal);
                console.log("Fetched profile data:", { u, p });
                setUser(u);
                setPosts(p);
            } catch (e: any) {
                if (e?.name === "AbortError") return;
                setError(e?.message ?? "Something went wrong");
            } finally {
                setLoading(false);
            }
        })();

        return () => ac.abort();
    }, [username]);

    if (loading) return <div style={s.page}>Loading profile…</div>;
    if (error) return <div style={s.page}>Error: {error}</div>;
    if (!user) return <div style={s.page}>User not found</div>;

    return (
        <div style={s.page}>
            {/* Header */}
            <div style={s.header}>
                <ProfileImage user={user} width={120} height={120} />

                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={s.topRow}>
                        <div style={s.usernameRow}>
                            <div style={s.username}>{user.username}</div>
                            {user.isVerified && (
                                <img
                                    src={Verified}
                                    alt="Verified"
                                    aria-hidden="true"
                                    style={s.verified}
                                />
                            )}
                        </div>

                        <div style={s.actions}>
                            <button style={s.primaryBtn}>Follow</button>
                            <button style={s.secondaryBtn}>Message</button>
                        </div>
                    </div>

                    {user.name && (
                        <div style={{ textAlign: "start", fontSize: 14 }}>{user.name}</div>
                    )}

                    {/* Stats */}
                    <div style={s.stats}>
                        <div>
                            <b>{formatToShortNumber(user.postsCount)}</b> posts
                        </div>
                        <div>
                            <b>{formatToShortNumber(user.followersCount)}</b> followers
                        </div>
                        <div>
                            <b>{formatToShortNumber(user.followingsCount)}</b> following
                        </div>
                    </div>
                </div>
            </div>

            <div style={s.divider} />

            {/* Grid */}
            <div style={s.grid}>
                {posts.map((p) => {
                    const cover = p.imageUrls?.[0];
                    return (
                        <div key={p.id} style={s.gridItem} title={p.caption ?? ""}>
                            {cover ? (
                                <img
                                    src={cover}
                                    alt=""
                                    aria-hidden="true"
                                    style={s.gridImg}
                                    draggable={false}
                                />
                            ) : (
                                <div style={s.empty}>No image</div>
                            )}
                        </div>
                    );
                })}
            </div>

            {posts.length === 0 && <div style={s.emptyState}>No posts yet.</div>}
        </div>
    );
}

const s: Record<string, React.CSSProperties> = {
    page: {
        maxWidth: 935,
        margin: "0 auto",
        padding: "16px 12px",
        color: "#fff",
    },
    header: {
        display: "flex",
        gap: 28,
        alignItems: "center",
        padding: "12px 0 18px",
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: "50%",
        objectFit: "cover",
        border: "1px solid rgba(255,255,255,0.12)",
    },
    topRow: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        flexWrap: "wrap",
    },
    usernameRow: { display: "flex", alignItems: "center", gap: 8 },
    username: { fontSize: 22, fontWeight: 800 },
    verified: { width: 16, height: 16 },
    actions: { display: "flex", gap: 8 },
    primaryBtn: {
        padding: "8px 12px",
        borderRadius: 10,
        border: "none",
        background: "#2d6cff",
        color: "#fff",
        fontWeight: 800,
        cursor: "pointer",
    },
    secondaryBtn: {
        padding: "8px 12px",
        borderRadius: 10,
        border: "1px solid rgba(255,255,255,0.16)",
        background: "transparent",
        color: "#fff",
        fontWeight: 800,
        cursor: "pointer",
    },
    stats: {
        display: "flex",
        gap: 18,
        fontSize: 14,
    },
    bio: { marginTop: 12, lineHeight: 1.25 },
    divider: { height: 1, background: "rgba(255,255,255,0.10)", margin: "12px 0 18px" },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: 4,
        paddingBottom: 32,
    },
    gridItem: {
        aspectRatio: "1 / 1",
        overflow: "hidden",
        borderRadius: 6,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.06)",
    },
    gridImg: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
        userSelect: "none",
        pointerEvents: "none", // ✅ no click effects
    },
    empty: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: 0.7,
        fontSize: 12,
    },
    emptyState: { marginTop: 16, opacity: 0.7 },
};
