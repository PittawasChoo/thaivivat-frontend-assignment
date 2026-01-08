import { useEffect, useRef } from "react";

type Options = {
  enabled: boolean;
  onIntersect: () => void;
  root?: Element | null;
  rootMargin?: string;
  threshold?: number;
};

const THRESHOLD = 0;

export function useInfiniteObserver({
  enabled,
  onIntersect,
  root = null,
  rootMargin = "600px",
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
      { root, rootMargin, threshold: THRESHOLD }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled, onIntersect, root, rootMargin]);

  return ref;
}
