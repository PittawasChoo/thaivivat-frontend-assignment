import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

import { searchAccounts, type SearchUser } from "apis/searchApi";

import Verified from "assets/icons/verified.png";

import { useDebounce } from "hooks/useDebounce";

import { formatToShortNumber } from "utils/number";

import styles from "./SearchPanel.module.css";

type Recent = {
    id: number;
    username: string;
    name: string;
    avatarUrl: string;
    isVerified?: boolean;
    hasStory: boolean;
    followersCount: number;
    followingsCount: number;
    postCount: number;
};

const RECENTS_KEY = "ig_search_recents_accounts_v1";

function loadRecents(): Recent[] {
    try {
        const raw = localStorage.getItem(RECENTS_KEY);
        const arr = raw ? JSON.parse(raw) : [];
        return Array.isArray(arr) ? arr.slice(0, 10) : [];
    } catch {
        return [];
    }
}

function saveRecents(items: Recent[]) {
    localStorage.setItem(RECENTS_KEY, JSON.stringify(items.slice(0, 10)));
}

export default function SearchPanel({
    isWide,
    open,
    onClose,
}: {
    isWide: boolean;
    open: boolean;
    onClose: () => void;
}) {
    const [q, setQ] = useState("");
    const debounced = useDebounce(q.trim(), 600);

    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<SearchUser[]>([]);
    const [err, setErr] = useState<string | null>(null);

    const [recents, setRecents] = useState<Recent[]>(() => loadRecents());

    const panelRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const abortRef = useRef<AbortController | null>(null);

    // focus input when opened
    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 0);
        } else {
            setQ("");
            setUsers([]);
            setErr(null);
            setLoading(false);
            abortRef.current?.abort();
        }
    }, [open]);

    // close on outside click
    useEffect(() => {
        if (!open) return;

        const onDown = (e: MouseEvent) => {
            const el = panelRef.current;
            if (!el) return;
            if (!el.contains(e.target as Node)) onClose();
        };
        document.addEventListener("mousedown", onDown);
        return () => document.removeEventListener("mousedown", onDown);
    }, [open, onClose]);

    // close on ESC
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    // fetch accounts
    useEffect(() => {
        if (!open) return;

        if (!debounced) {
            setUsers([]);
            setErr(null);
            setLoading(false);
            abortRef.current?.abort();
            return;
        }

        abortRef.current?.abort();
        const ac = new AbortController();
        abortRef.current = ac;

        setLoading(true);
        setErr(null);

        searchAccounts(debounced, ac.signal)
            .then((res) => setUsers(res))
            .catch((e: any) => {
                if (e?.name === "AbortError") return;
                setErr("Search failed");
                setUsers([]);
            })
            .finally(() => setLoading(false));

        return () => ac.abort();
    }, [debounced, open]);

    const addRecent = (u: SearchUser) => {
        const item: Recent = { ...u };
        const next = [item, ...recents.filter((r) => r.id !== u.id)];
        setRecents(next);
        saveRecents(next);
    };

    const removeRecent = (id: number) => {
        const next = recents.filter((r) => r.id !== id);
        setRecents(next);
        saveRecents(next);
    };

    const clearAll = () => {
        setRecents([]);
        saveRecents([]);
    };

    if (!open) return null;

    return (
        <div
            ref={panelRef}
            style={{
                position: "fixed",
                top: 0,
                left: isWide ? 264 : 72, // adjust to your left nav width
                height: "100vh",
                width: 420,
                background: "#0c1013",
                borderRight: "1px solid rgba(255,255,255,0.08)",
                zIndex: 10,
                boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
                display: "flex",
                flexDirection: "column",
                gap: 12,
            }}
            role="dialog"
            aria-label="Search"
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: 16,
                }}
            >
                <div style={{ fontSize: 22, fontWeight: 900 }}>Search</div>
                <button
                    onClick={onClose}
                    style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        border: "1px solid rgba(255,255,255,0.15)",
                        background: "rgba(255,255,255,0.06)",
                        color: "#fff",
                        cursor: "pointer",
                    }}
                    aria-label="Close"
                >
                    ✕
                </button>
            </div>

            <div style={{ position: "relative", width: "100%", padding: "16px 16px 12px 16px" }}>
                <input
                    ref={inputRef}
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search"
                    style={{
                        width: "100%",
                        padding: "12px 40px 12px 14px",
                        borderRadius: 12,
                        border: "1px solid rgba(255,255,255,0.12)",
                        background: "rgba(255,255,255,0.06)",
                        color: "#fff",
                        outline: "none",
                        fontSize: 14,
                    }}
                />
                {q.length > 0 && (
                    <button
                        type="button"
                        onClick={() => setQ("")}
                        aria-label="Clear"
                        style={{
                            position: "absolute",
                            right: 26,
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            border: "1px solid rgba(255,255,255,0.15)",
                            background: "rgba(255,255,255,0.08)",
                            color: "#fff",
                            cursor: "pointer",
                        }}
                    >
                        ✕
                    </button>
                )}
            </div>

            <div style={{ flex: 1, overflow: "auto" }}>
                {/* Empty query => Recents */}
                {!debounced && (
                    <>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                margin: "12px 0",
                            }}
                        >
                            <div style={{ fontWeight: 900, padding: "0 16px" }}>Recent</div>
                            {recents.length > 0 && (
                                <button
                                    onClick={clearAll}
                                    style={{
                                        border: "none",
                                        background: "transparent",
                                        color: "#7aa7ff",
                                        cursor: "pointer",
                                        fontWeight: 800,
                                        padding: "0 16px",
                                    }}
                                >
                                    Clear all
                                </button>
                            )}
                        </div>

                        {recents.length === 0 ? (
                            <div style={{ opacity: 0.7, padding: "12px 0" }}>
                                No recent searches.
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                {recents.map((r) => (
                                    <div key={r.id} className={styles["recent-item-container"]}>
                                        <NavLink
                                            to={`/profile/${r.username}`}
                                            onClick={onClose}
                                            className={styles["recent-item"]}
                                        >
                                            <div
                                                className={`${styles["profile-container"]} ${
                                                    r.hasStory ? styles["has-story"] : ""
                                                }`}
                                            >
                                                <img
                                                    src={r.avatarUrl}
                                                    alt=""
                                                    aria-hidden="true"
                                                    className={styles["profile-img"]}
                                                />
                                            </div>
                                            <div
                                                style={{ display: "flex", flexDirection: "column" }}
                                            >
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        gap: 6,
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <span style={{ fontWeight: 900 }}>
                                                        {r.username}
                                                    </span>
                                                    {r.isVerified && (
                                                        <img
                                                            style={{
                                                                width: 16,
                                                                height: 16,
                                                            }}
                                                            src={Verified}
                                                            alt="Verified Account"
                                                            aria-hidden="true"
                                                        />
                                                    )}
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: 14,
                                                        opacity: 0.7,
                                                        textAlign: "left",
                                                        gap: 4,
                                                        display: "flex",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <span>{r.name}</span>
                                                    <span>•</span>
                                                    <span>
                                                        {formatToShortNumber(r.followersCount)}{" "}
                                                        followers
                                                    </span>
                                                </div>
                                            </div>
                                        </NavLink>

                                        <button
                                            onClick={() => removeRecent(r.id)}
                                            style={{
                                                border: "none",
                                                background: "transparent",
                                                color: "#aaa",
                                                cursor: "pointer",
                                                padding: "12px 24px",
                                            }}
                                            aria-label="Remove"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* Query => Results */}
                {!!debounced && (
                    <>
                        {loading && (
                            <div style={{ opacity: 0.7, padding: "12px 0" }}>Searching…</div>
                        )}
                        {!loading && err && (
                            <div
                                style={{
                                    padding: 12,
                                    borderRadius: 12,
                                    background: "rgba(255,0,0,0.08)",
                                }}
                            >
                                {err}
                            </div>
                        )}
                        {!loading && !err && users.length === 0 && (
                            <div style={{ opacity: 0.7, padding: "12px 0" }}>No results.</div>
                        )}

                        {!loading && !err && users.length > 0 && (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                {users.map((u) => (
                                    <NavLink
                                        key={u.id}
                                        to={`/profile/${u.username}`}
                                        onClick={() => {
                                            addRecent(u);
                                            onClose();
                                        }}
                                        className={styles.item}
                                    >
                                        <div
                                            className={`${styles["profile-container"]} ${
                                                u.hasStory ? styles["has-story"] : ""
                                            }`}
                                        >
                                            <img
                                                src={u.avatarUrl}
                                                alt=""
                                                aria-hidden="true"
                                                className={styles["profile-img"]}
                                            />
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    gap: 6,
                                                    alignItems: "center",
                                                }}
                                            >
                                                <span style={{ fontWeight: 900 }}>
                                                    {u.username}
                                                </span>
                                                {u.isVerified && (
                                                    <img
                                                        style={{
                                                            width: 16,
                                                            height: 16,
                                                        }}
                                                        src={Verified}
                                                        alt="Verified Account"
                                                        aria-hidden="true"
                                                    />
                                                )}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: 14,
                                                    opacity: 0.7,
                                                    textAlign: "left",
                                                    gap: 4,
                                                    display: "flex",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <span>{u.name}</span>
                                                <span>•</span>
                                                <span>
                                                    {formatToShortNumber(u.followersCount)}{" "}
                                                    followers
                                                </span>
                                            </div>
                                        </div>
                                    </NavLink>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
