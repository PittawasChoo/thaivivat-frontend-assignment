const sizeCache = new Map<string, { w: number; h: number }>();

export function loadImageSize(src: string) {
    return new Promise<{ w: number; h: number }>((res, rej) => {
        const cached = sizeCache.get(src);
        if (cached) return res(cached);

        const img = new Image();
        img.onload = () => {
            const val = { w: img.naturalWidth, h: img.naturalHeight };
            sizeCache.set(src, val);
            res(val);
        };
        img.onerror = rej;
        img.src = src;
    });
}
