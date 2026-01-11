import ProfileImage from "components/profile-image/ProfileImage";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { User } from "types/user";
import Verified from "assets/icons/verified.png";
import { formatToShortNumber } from "utils/number";
import { useNavigate } from "react-router-dom";

type Props = {
    user: User;
    children: React.ReactNode; // the thing you hover (username / avatar)
    renderCard?: (user: User) => React.ReactNode; // optional custom UI
    openDelayMs?: number;
    closeDelayMs?: number;
};

export default function ProfileHoverCard({
    user,
    children,
    renderCard,
    openDelayMs = 150,
    closeDelayMs = 120,
}: Props) {
    const navigate = useNavigate();
    const anchorRef = useRef<HTMLSpanElement | null>(null);
    const cardRef = useRef<HTMLDivElement | null>(null);

    const openTimer = useRef<number | null>(null);
    const closeTimer = useRef<number | null>(null);

    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

    const clearTimers = () => {
        if (openTimer.current) window.clearTimeout(openTimer.current);
        if (closeTimer.current) window.clearTimeout(closeTimer.current);
        openTimer.current = null;
        closeTimer.current = null;
    };

    const computePosition = () => {
        const el = anchorRef.current;
        if (!el) return;

        const r = el.getBoundingClientRect();
        const width = 320; // card width
        const gap = 10;

        // default: below-left aligned
        let left = r.left;
        let top = r.bottom + gap;

        // keep inside viewport horizontally
        const maxLeft = window.innerWidth - width - 10;
        left = Math.max(10, Math.min(left, maxLeft));

        // if too low, place above
        const estimatedHeight = 220;
        if (top + estimatedHeight > window.innerHeight) {
            top = r.top - gap - estimatedHeight;
        }
        top = Math.max(10, top);

        setPos({ top, left });
    };

    const openWithDelay = () => {
        clearTimers();
        openTimer.current = window.setTimeout(() => {
            computePosition();
            setOpen(true);
        }, openDelayMs);
    };

    const closeWithDelay = () => {
        clearTimers();
        closeTimer.current = window.setTimeout(() => {
            setOpen(false);
        }, closeDelayMs);
    };

    // Reposition on open + on scroll/resize
    useLayoutEffect(() => {
        if (!open) return;
        computePosition();

        const onScroll = () => computePosition();
        const onResize = () => computePosition();
        window.addEventListener("scroll", onScroll, true);
        window.addEventListener("resize", onResize);
        return () => {
            window.removeEventListener("scroll", onScroll, true);
            window.removeEventListener("resize", onResize);
        };
    }, [open]);

    // close on Escape
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    // if click outside, close (optional)
    useEffect(() => {
        if (!open) return;
        const onDown = (e: MouseEvent) => {
            const a = anchorRef.current;
            const c = cardRef.current;
            if (!a || !c) return;
            const t = e.target as Node;
            if (!a.contains(t) && !c.contains(t)) setOpen(false);
        };
        window.addEventListener("mousedown", onDown);
        return () => window.removeEventListener("mousedown", onDown);
    }, [open]);

    const defaultCard = (
        <>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <ProfileImage user={user} width={60} height={60} />
                <div>
                    <div style={{ minWidth: 0, display: "flex", gap: 5, alignItems: "center" }}>
                        <span style={styles.user}>{user.username}</span>
                        {user.isVerified && (
                            <img
                                style={styles.verified}
                                src={Verified}
                                alt="Verified Account"
                                aria-hidden="true"
                            />
                        )}
                    </div>
                    {user.name && <div style={{ opacity: 0.8, fontSize: 13 }}>{user.name}</div>}
                </div>
            </div>
            <div style={{ marginTop: 12, display: "flex", justifyContent: "space-around" }}>
                <div style={{ textAlign: "center", width: "20%" }}>
                    <p style={{ margin: 0, lineHeight: "16px", fontWeight: 800 }}>
                        {formatToShortNumber(user.postsCount)}
                    </p>
                    <p style={{ margin: 0, fontSize: 13 }}>posts</p>
                </div>
                <div style={{ textAlign: "center", width: "20%" }}>
                    <p style={{ margin: 0, lineHeight: "16px", fontWeight: 800 }}>
                        {formatToShortNumber(user.followersCount)}
                    </p>
                    <p style={{ margin: 0, fontSize: 13 }}>followers</p>
                </div>
                <div style={{ textAlign: "center", width: "20%" }}>
                    <p style={{ margin: 0, lineHeight: "16px", fontWeight: 800 }}>
                        {formatToShortNumber(user.followingsCount)}
                    </p>
                    <p style={{ margin: 0, fontSize: 13 }}>following</p>
                </div>
            </div>

            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                <button style={styles.btn} onClick={() => navigate(`/profile/${user.username}`)}>
                    View Profile
                </button>
            </div>
        </>
    );

    return (
        <>
            <span
                ref={anchorRef}
                onMouseEnter={openWithDelay}
                onMouseLeave={closeWithDelay}
                onFocus={openWithDelay}
                onBlur={closeWithDelay}
                style={{ display: "inline-flex" }}
            >
                {children}
            </span>

            {open &&
                createPortal(
                    <div
                        ref={cardRef}
                        onMouseEnter={() => {
                            clearTimers();
                            // keep open when hovering the card
                        }}
                        onMouseLeave={closeWithDelay}
                        style={{
                            position: "fixed",
                            top: pos.top,
                            left: pos.left,
                            width: 320,
                            padding: 14,
                            borderRadius: 14,
                            background: "rgba(18, 20, 24, 0.98)",
                            border: "1px solid rgba(255,255,255,0.10)",
                            boxShadow: "0 18px 50px rgba(0,0,0,0.45)",
                            zIndex: 9999,
                            color: "#fff",
                            backdropFilter: "blur(10px)",
                        }}
                        role="dialog"
                        aria-label={`Profile preview for ${user.username}`}
                    >
                        {renderCard ? renderCard(user) : defaultCard}
                    </div>,
                    document.body
                )}
        </>
    );
}

const styles: Record<string, React.CSSProperties> = {
    btn: {
        width: "100%",
        padding: "8px 12px",
        borderRadius: 10,
        border: "none",
        background: "#2d6cff",
        color: "#fff",
        fontWeight: 800,
        cursor: "pointer",
    },
    user: { fontSize: 16, fontWeight: 800 },
    verified: {
        width: 16,
        height: 16,
    },
};
