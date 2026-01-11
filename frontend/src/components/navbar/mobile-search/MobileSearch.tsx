import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import Verified from "assets/icons/verified.png";
import { searchAccounts } from "apis/searchApi";
import ProfileImage from "components/profile-image/ProfileImage";
import { useDebounce } from "hooks/useDebounce";

import type { User } from "types/user";
import { formatToShortNumber } from "utils/number";

import {
    Bar,
    ClearButton,
    Dropdown,
    EmptyText,
    HeaderRow,
    Input,
    ItemLink,
    Left,
    List,
    Pill,
    RecentRow,
    RemoveButton,
    Right,
    RowSub,
    RowText,
    RowTop,
    Strong,
    VerifiedIcon,
} from "./MobileSearch.styles";

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

export default function MobileSearch() {
    const location = useLocation();

    const [q, setQ] = useState("");
    const debounced = useDebounce(q.trim(), 450);

    const [focused, setFocused] = useState(false);
    const [recents, setRecents] = useState<User[]>(() => loadRecents());

    const inputRef = useRef<HTMLInputElement | null>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    // close dropdown on route change
    useEffect(() => {
        setFocused(false);
    }, [location.pathname]);

    // click outside to hide dropdown
    useEffect(() => {
        if (!focused) return;

        const onDown = (e: MouseEvent) => {
            const t = e.target as HTMLElement | null;
            const inputEl = inputRef.current;
            const dd = dropdownRef.current;

            if (inputEl && inputEl.contains(t as Node)) return;
            if (dd && dd.contains(t as Node)) return;

            setFocused(false);
        };

        document.addEventListener("mousedown", onDown);
        return () => document.removeEventListener("mousedown", onDown);
    }, [focused]);

    const searchQuery = useQuery<User[]>({
        queryKey: ["searchAccountsMobile", debounced],
        enabled: focused && !!debounced,
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

    const showDropdown = focused; //only show while focused

    return (
        <>
            <Bar>
                <Input
                    ref={inputRef}
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    onFocus={() => setFocused(true)}
                    placeholder="Search"
                    aria-label="Search accounts"
                />

                {q.length > 0 && (
                    <ClearButton type="button" onClick={() => setQ("")} aria-label="Clear">
                        ✕
                    </ClearButton>
                )}
            </Bar>

            {showDropdown && (
                <Dropdown ref={dropdownRef} role="dialog" aria-label="Search results">
                    {/* Empty query => recents */}
                    {!debounced ? (
                        <>
                            <HeaderRow>
                                <Left>
                                    <Strong>Recent</Strong>
                                </Left>
                                <Right>
                                    {recents.length > 0 && (
                                        <Pill type="button" onClick={clearAll}>
                                            Clear all
                                        </Pill>
                                    )}
                                </Right>
                            </HeaderRow>

                            {recents.length === 0 ? (
                                <EmptyText>No recent searches.</EmptyText>
                            ) : (
                                <List>
                                    {recents.map((r) => (
                                        <RecentRow key={r.id}>
                                            <ItemLink
                                                as={NavLink}
                                                to={`/profile/${r.username}`}
                                                onClick={() => setFocused(false)}
                                            >
                                                <ProfileImage
                                                    user={r}
                                                    width={44}
                                                    height={44}
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
                                                        <span>•</span>
                                                        <span>
                                                            {formatToShortNumber(r.followersCount)}{" "}
                                                            followers
                                                        </span>
                                                    </RowSub>
                                                </RowText>
                                            </ItemLink>

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
                            {!loading && err && <EmptyText>{err}</EmptyText>}
                            {!loading && !err && users.length === 0 && (
                                <EmptyText>No results.</EmptyText>
                            )}

                            {!loading && !err && users.length > 0 && (
                                <List>
                                    {users.map((u) => (
                                        <ItemLink
                                            key={u.id}
                                            as={NavLink}
                                            to={`/profile/${u.username}`}
                                            onClick={() => {
                                                addRecent(u);
                                                setFocused(false);
                                            }}
                                        >
                                            <ProfileImage
                                                user={u}
                                                width={44}
                                                height={44}
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
                                                    <span>•</span>
                                                    <span>
                                                        {formatToShortNumber(u.followersCount)}{" "}
                                                        followers
                                                    </span>
                                                </RowSub>
                                            </RowText>
                                        </ItemLink>
                                    ))}
                                </List>
                            )}
                        </>
                    )}
                </Dropdown>
            )}
        </>
    );
}
