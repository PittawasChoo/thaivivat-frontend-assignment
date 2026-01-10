import { useRef, useState } from "react";

type Props = {
    src: string;
    alt?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
    onDoubleClick?: () => void;
};

const CLICK_DELAY = 350;

export default function SmartImage({ src, alt = "", style, onClick, onDoubleClick }: Props) {
    const retried = useRef(false);
    const [currentSrc, setCurrentSrc] = useState(src);

    const clickTimer = useRef<number | null>(null);

    const handleClick = () => {
        if (!onClick) return;

        // already waiting for potential dblclick
        if (clickTimer.current) return;

        clickTimer.current = window.setTimeout(() => {
            onClick();
            clickTimer.current = null;
        }, CLICK_DELAY);
    };

    const handleDoubleClick = () => {
        // cancel single-click if pending
        if (clickTimer.current) {
            clearTimeout(clickTimer.current);
            clickTimer.current = null;
        }
        onDoubleClick?.();
    };

    return (
        <img
            src={currentSrc}
            alt={alt}
            style={style}
            loading="lazy"
            decoding="async"
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            onError={() => {
                // retry once with cache-buster (helps with flaky CDNs/redirects)
                if (!retried.current) {
                    retried.current = true;
                    setCurrentSrc(`${src}${src.includes("?") ? "&" : "?"}t=${Date.now()}`);
                    return;
                }

                // fallback placeholder
                setCurrentSrc("/placeholder.png"); // put a placeholder in /public
            }}
        />
    );
}
