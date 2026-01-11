import React, { useEffect, useRef, useState } from "react";

const CLICK_DELAY = 350;

type SmartImageProps = Omit<
    React.ImgHTMLAttributes<HTMLImageElement>,
    "onClick" | "onDoubleClick" | "src"
> & {
    src: string;
    onClick?: () => void;
    onDoubleClick?: () => void;
};

const SmartImage = ({
    src,
    alt = "",
    style,
    className,
    onClick,
    onDoubleClick,
    ...imgProps
}: SmartImageProps) => {
    const retried = useRef(false);
    const clickTimer = useRef<number | null>(null);

    const [currentSrc, setCurrentSrc] = useState(src);

    // keep in sync if parent changes src (important for carousels)
    useEffect(() => {
        retried.current = false;
        setCurrentSrc(src);
    }, [src]);

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
            window.clearTimeout(clickTimer.current);
            clickTimer.current = null;
        }
        onDoubleClick?.();
    };

    // cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (clickTimer.current) window.clearTimeout(clickTimer.current);
        };
    }, []);

    return (
        <img
            {...imgProps}
            className={className}
            src={currentSrc}
            alt={alt}
            style={style}
            loading={imgProps.loading ?? "lazy"}
            decoding={imgProps.decoding ?? "async"}
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
                setCurrentSrc("/placeholder.jpeg"); // put a placeholder in /public
            }}
        />
    );
};

export default SmartImage;
