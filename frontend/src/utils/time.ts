export function formatPostTime(timestamp: string, now = new Date(), locale?: string) {
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();

    // future / clock skew
    if (diffMs < 0) return "just now";

    const sec = Math.floor(diffMs / 1000);
    const min = Math.floor(sec / 60);
    const hr = Math.floor(min / 60);
    const day = Math.floor(hr / 24);

    if (sec < 30) return "just now";
    if (min < 60) return `${min} minute${min === 1 ? "" : "s"} ago`;
    if (hr < 24) return `${hr} hour${hr === 1 ? "" : "s"} ago`;
    if (day < 7) return `${day} day${day === 1 ? "" : "s"} ago`;

    // 7+ days → show date in user's locale
    return new Intl.DateTimeFormat(locale ?? undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(date);
}
