import { useEffect, useRef } from "react";

type Options = {
    enabled: boolean;
    onIntersect: () => void;
    root?: Element | null;
    rootMargin?: string;
    threshold?: number;
};

export function useInfiniteObserver({
    enabled,
    onIntersect,
    root = null,
    rootMargin = "600px",
    threshold = 0,
}: Options) {
    const ref = useRef<HTMLDivElement | null>(null);
    const onIntersectRef = useRef(onIntersect);

    // keep latest callback without re-creating observer
    useEffect(() => {
        onIntersectRef.current = onIntersect;
    }, [onIntersect]);

    useEffect(() => {
        if (!enabled) return;

        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (first?.isIntersecting) onIntersectRef.current();
            },
            { root, rootMargin, threshold }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [enabled, root, rootMargin, threshold]);

    return ref;
}
