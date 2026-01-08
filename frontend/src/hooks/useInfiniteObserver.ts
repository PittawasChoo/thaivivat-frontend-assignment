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
  rootMargin = "600px", // prefetch-ish: starts earlier
  threshold = 0,
}: Options) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first?.isIntersecting) onIntersect();
      },
      { root, rootMargin, threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled, onIntersect, root, rootMargin, threshold]);

  return ref;
}
