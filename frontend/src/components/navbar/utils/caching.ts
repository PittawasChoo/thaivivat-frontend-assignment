import type { User } from "types/user";

const RECENTS_KEY = "ig_search_recents_accounts_v1";

export function loadRecents(): User[] {
    try {
        const raw = localStorage.getItem(RECENTS_KEY);
        const arr = raw ? JSON.parse(raw) : [];
        return Array.isArray(arr) ? (arr.slice(0, 10) as User[]) : [];
    } catch {
        return [];
    }
}

export function saveRecents(items: User[]) {
    localStorage.setItem(RECENTS_KEY, JSON.stringify(items.slice(0, 10)));
}
