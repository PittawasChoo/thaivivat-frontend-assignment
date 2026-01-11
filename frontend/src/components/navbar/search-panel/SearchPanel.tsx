import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

import { searchAccounts } from "apis/searchApi";

import Verified from "assets/icons/verified.png";

import ProfileImage from "components/profile-image/ProfileImage";

import { useDebounce } from "hooks/useDebounce";

import type { User } from "types/user";

import { formatToShortNumber } from "utils/number";

import {
    Backdrop,
    Body,
    ClearAllButton,
    ClearButton,
    CloseButton,
    Dot,
    EmptyText,
    ErrorBox,
    Header,
    Input,
    List,
    Panel,
    RecentRow,
    RecentsHeader,
    RecentsTitle,
    RemoveButton,
    ResultLink,
    RowLink,
    RowSub,
    RowText,
    RowTop,
    SearchBar,
    Strong,
    Title,
    VerifiedIcon,
} from "./SearchPanel.styles";

const RECENTS_KEY = "ig_search_recents_accounts_v1";

function loadRecents(): User[] {
    try {
        const raw = localStorage.getItem(RECENTS_KEY);
        const arr = raw ? JSON.parse(raw) : [];
        return Array.isArray(arr) ? arr.slice(0, 10) : [];
    } catch {
        return [];
    }
}

function saveRecents(items: User[]) {
    localStorage.setItem(RECENTS_KEY, JSON.stringify(items.slice(0, 10)));
}

type Props = {
    isWide: boolean;
    open: boolean;
    onClose: () => void;
};

export default function SearchPanel({ isWide, open, onClose }: Props) {
    const [q, setQ] = useState("");
    const debounced = useDebounce(q.trim(), 600);

    const [recents, setRecents] = useState<User[]>(() => loadRecents());

    const panelRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    // focus on open
    useEffect(() => {
        if (!open) return;
        const t = window.setTimeout(() => inputRef.current?.focus(), 0);
        return () => window.clearTimeout(t);
    }, [open]);

    // close on esc
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    // close on outside click
    useEffect(() => {
        if (!open) return;

        const onDown = (e: MouseEvent) => {
            const target = e.target as HTMLElement | null;

            // ignore clicking the navbar Search button (so it can toggle)
            if (target?.closest?.('[data-search-toggle="true"]')) return;

            const el = panelRef.current;
            if (!el) return;
            if (!el.contains(target as Node)) onClose();
        };

        document.addEventListener("mousedown", onDown);
        return () => document.removeEventListener("mousedown", onDown);
    }, [open, onClose]);

    const searchQuery = useQuery<User[]>({
        queryKey: ["searchAccounts", debounced],
        enabled: open && !!debounced,
        queryFn: ({ signal }) => searchAccounts(debounced, signal),
        staleTime: 30_000,
    });

    const loading = searchQuery.isFetching;
    const err = searchQuery.isError ? "Search failed" : null;
    const users = searchQuery.data ?? [];

    const addRecent = (u: User) => {
        const next = [u, ...recents.filter((r) => r.id !== u.id)];
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

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Overlay */}
                    <Backdrop
                        as={motion.div}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        onClick={onClose}
                    />

                    <Panel
                        as={motion.div}
                        ref={panelRef}
                        $left={isWide ? 240 : 72}
                        role="dialog"
                        aria-label="Search"
                        initial={{ x: -24, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -24, opacity: 0 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                    >
                        <Header>
                            <Title>Search</Title>
                            <CloseButton type="button" onClick={onClose} aria-label="Close">
                                ✕
                            </CloseButton>
                        </Header>

                        <SearchBar>
                            <Input
                                ref={inputRef}
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Search"
                            />

                            {q.length > 0 && (
                                <ClearButton
                                    type="button"
                                    onClick={() => setQ("")}
                                    aria-label="Clear"
                                >
                                    ✕
                                </ClearButton>
                            )}
                        </SearchBar>

                        <Body>
                            {!debounced ? (
                                <>
                                    <RecentsHeader>
                                        <RecentsTitle>Recent</RecentsTitle>
                                        {recents.length > 0 && (
                                            <ClearAllButton type="button" onClick={clearAll}>
                                                Clear all
                                            </ClearAllButton>
                                        )}
                                    </RecentsHeader>

                                    {recents.length === 0 ? (
                                        <EmptyText>No recent searches.</EmptyText>
                                    ) : (
                                        <List>
                                            {recents.map((r) => (
                                                <RecentRow key={r.id}>
                                                    <RowLink
                                                        to={`/profile/${r.username}`}
                                                        onClick={onClose}
                                                    >
                                                        <ProfileImage
                                                            user={r}
                                                            width={56}
                                                            height={56}
                                                            clickable={false}
                                                        />
                                                        <RowText>
                                                            <RowTop>
                                                                <Strong>{r.username}</Strong>
                                                                {r.isVerified && (
                                                                    <VerifiedIcon
                                                                        src={Verified}
                                                                        alt="Verified"
                                                                        aria-hidden="true"
                                                                    />
                                                                )}
                                                            </RowTop>
                                                            <RowSub>
                                                                <span>{r.name}</span>
                                                                <Dot>•</Dot>
                                                                <span>
                                                                    {formatToShortNumber(
                                                                        r.followersCount
                                                                    )}{" "}
                                                                    followers
                                                                </span>
                                                            </RowSub>
                                                        </RowText>
                                                    </RowLink>

                                                    <RemoveButton
                                                        type="button"
                                                        onClick={() => removeRecent(r.id)}
                                                        aria-label="Remove"
                                                    >
                                                        ✕
                                                    </RemoveButton>
                                                </RecentRow>
                                            ))}
                                        </List>
                                    )}
                                </>
                            ) : (
                                <>
                                    {loading && <EmptyText>Searching…</EmptyText>}
                                    {!loading && err && <ErrorBox>{err}</ErrorBox>}
                                    {!loading && !err && users.length === 0 && (
                                        <EmptyText>No results.</EmptyText>
                                    )}

                                    {!loading && !err && users.length > 0 && (
                                        <List>
                                            {users.map((u) => (
                                                <ResultLink
                                                    key={u.id}
                                                    to={`/profile/${u.username}`}
                                                    onClick={() => {
                                                        addRecent(u);
                                                        onClose();
                                                    }}
                                                >
                                                    <ProfileImage
                                                        user={u}
                                                        width={56}
                                                        height={56}
                                                        clickable={false}
                                                    />
                                                    <RowText>
                                                        <RowTop>
                                                            <Strong>{u.username}</Strong>
                                                            {u.isVerified && (
                                                                <VerifiedIcon
                                                                    src={Verified}
                                                                    alt="Verified"
                                                                    aria-hidden="true"
                                                                />
                                                            )}
                                                        </RowTop>
                                                        <RowSub>
                                                            <span>{u.name}</span>
                                                            <Dot>•</Dot>
                                                            <span>
                                                                {formatToShortNumber(
                                                                    u.followersCount
                                                                )}{" "}
                                                                followers
                                                            </span>
                                                        </RowSub>
                                                    </RowText>
                                                </ResultLink>
                                            ))}
                                        </List>
                                    )}
                                </>
                            )}
                        </Body>
                    </Panel>
                </>
            )}
        </AnimatePresence>
    );
}
