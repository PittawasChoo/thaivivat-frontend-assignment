// src/components/navbar/search-panel/SearchPanel.tsx
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchAccounts } from "apis/searchApi";
import Verified from "assets/icons/verified.png";
import ProfileImage from "components/profile-image/ProfileImage";
import { useDebounce } from "hooks/useDebounce";
import type { User } from "types/user";

import { formatToShortNumber } from "utils/number";

import {
    Body,
    ClearButton,
    ErrorBox,
    Header,
    IconButton,
    Input,
    LinkButton,
    List,
    Muted,
    Panel,
    RecentLink,
    RecentRow,
    RemoveButton,
    SearchBox,
    SectionHeader,
    SectionTitle,
    Title,
    RowLink,
    UserMeta,
    UserSub,
    UserTop,
    Username,
    VerifiedIcon,
} from "./SearchPanel.styles";

import { loadRecents, saveRecents } from "../utils/caching";

type SearchPanelProps = {
    isWide: boolean;
    open: boolean;
    onClose: () => void;
};

const SearchPanel = ({ isWide, open, onClose }: SearchPanelProps) => {
    const [q, setQ] = useState("");
    const debounced = useDebounce(q.trim(), 600);

    const searchQuery = useQuery({
        queryKey: ["searchAccounts", debounced],
        enabled: open && !!debounced,
        queryFn: ({ signal }) => searchAccounts(debounced, signal),
        staleTime: 30_000,
    });

    const loading = searchQuery.isFetching;
    const err = searchQuery.isError ? "Search failed" : null;
    const users = searchQuery.data ?? [];

    const [recents, setRecents] = useState<User[]>(() => loadRecents());

    const panelRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    // focus input when opened
    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 0);
            return;
        }

        setQ("");
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

    const addRecent = (u: User) => {
        const item: User = { ...u };
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

    const left = isWide ? 264 : 72; // match your left nav width

    return (
        <Panel ref={panelRef} $left={left} role="dialog" aria-label="Search">
            <Header>
                <Title>Search</Title>
                <IconButton onClick={onClose} aria-label="Close">
                    ✕
                </IconButton>
            </Header>

            <SearchBox>
                <Input
                    ref={inputRef}
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search"
                />
                {q.length > 0 && (
                    <ClearButton type="button" onClick={() => setQ("")} aria-label="Clear">
                        ✕
                    </ClearButton>
                )}
            </SearchBox>

            <Body>
                {/* Empty query => Recents */}
                {!debounced && (
                    <>
                        <SectionHeader>
                            <SectionTitle>Recent</SectionTitle>
                            {recents.length > 0 && (
                                <LinkButton onClick={clearAll}>Clear all</LinkButton>
                            )}
                        </SectionHeader>

                        {recents.length === 0 ? (
                            <Muted>No recent searches.</Muted>
                        ) : (
                            <List>
                                {recents.map((r) => (
                                    <RecentRow key={r.id}>
                                        <RecentLink to={`/profile/${r.username}`} onClick={onClose}>
                                            <ProfileImage
                                                user={r}
                                                width={56}
                                                height={56}
                                                clickable={false}
                                            />

                                            <UserMeta>
                                                <UserTop>
                                                    <Username>{r.username}</Username>
                                                    {r.isVerified && (
                                                        <VerifiedIcon
                                                            src={Verified}
                                                            alt="Verified Account"
                                                            aria-hidden="true"
                                                        />
                                                    )}
                                                </UserTop>

                                                <UserSub>
                                                    <span>{r.name}</span>
                                                    <span>•</span>
                                                    <span>
                                                        {formatToShortNumber(r.followersCount)}{" "}
                                                        followers
                                                    </span>
                                                </UserSub>
                                            </UserMeta>
                                        </RecentLink>

                                        <RemoveButton
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
                )}

                {/* Query => Results */}
                {!!debounced && (
                    <>
                        {loading && <Muted>Searching…</Muted>}

                        {!loading && err && <ErrorBox>{err}</ErrorBox>}

                        {!loading && !err && users.length === 0 && <Muted>No results.</Muted>}

                        {!loading && !err && users.length > 0 && (
                            <List>
                                {users.map((u) => (
                                    <RowLink
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

                                        <UserMeta>
                                            <UserTop>
                                                <Username>{u.username}</Username>
                                                {u.isVerified && (
                                                    <VerifiedIcon
                                                        src={Verified}
                                                        alt="Verified Account"
                                                        aria-hidden="true"
                                                    />
                                                )}
                                            </UserTop>

                                            <UserSub>
                                                <span>{u.name}</span>
                                                <span>•</span>
                                                <span>
                                                    {formatToShortNumber(u.followersCount)}{" "}
                                                    followers
                                                </span>
                                            </UserSub>
                                        </UserMeta>
                                    </RowLink>
                                ))}
                            </List>
                        )}
                    </>
                )}
            </Body>
        </Panel>
    );
};

export default SearchPanel;
