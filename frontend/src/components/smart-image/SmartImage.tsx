import { useRef, useState } from "react";

type Props = {
  src: string;
  alt?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  onDoubleClick?: () => void;
};

export default function SmartImage({
  src,
  alt = "",
  style,
  onClick,
  onDoubleClick,
}: Props) {
  const retried = useRef(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  return (
    <img
      src={currentSrc}
      alt={alt}
      style={style}
      loading="lazy"
      decoding="async"
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onError={() => {
        // retry once with cache-buster (helps with flaky CDNs/redirects)
        if (!retried.current) {
          retried.current = true;
          setCurrentSrc(
            `${src}${src.includes("?") ? "&" : "?"}t=${Date.now()}`
          );
          return;
        }

        // fallback placeholder
        setCurrentSrc("/placeholder.png"); // put a placeholder in /public
      }}
    />
  );
}
