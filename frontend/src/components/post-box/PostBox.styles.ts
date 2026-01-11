import styled from "styled-components";
import { motion } from "framer-motion";

import SmartImage from "components/smart-image/SmartImage";

export const Card = styled.div`
    background: #0c1013;
`;

export const HeaderRow = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    padding: 0 12px 12px 12px;
    gap: 12px;
`;

export const UserMeta = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
`;

export const UserTop = styled.div`
    display: flex;
    gap: 5px;
    align-items: center;
`;

export const Username = styled.span`
    font-size: 16px;
    font-weight: 800;
    cursor: pointer;
`;

export const VerifiedIcon = styled.img`
    width: 16px;
    height: 16px;
`;

export const TimeRow = styled.div`
    display: flex;
    gap: 5px;
    align-items: center;
    font-size: 16px;
    color: #a8a8a8;
`;

export const LocationText = styled.span`
    font-size: 12px;
`;

export const ImageContainer = styled.div<{ $height: number }>`
    position: relative;
    width: 100%;
    height: ${({ $height }) => `${$height}px`};
    overflow: hidden;
    border-radius: 10px;
    border: 1px solid rgba(200, 200, 200, 0.3);
`;

export const Track = styled.div<{ $active: number }>`
    display: flex;
    height: 100%;
    transform: translateX(-${({ $active }) => $active * 100}%);
    transition: transform 300ms ease;
`;

export const Slide = styled.div`
    flex: 0 0 100%;
    height: 100%;
    position: relative;
`;

export const PostImage = styled(SmartImage)<{ $portrait: boolean }>`
    width: 100%;
    height: 100%;
    display: block;
    cursor: pointer;
    object-fit: ${({ $portrait }) => ($portrait ? "cover" : "contain")};
    object-position: center;
`;

export const TagToggle = styled.button`
    width: 28px;
    height: 28px;
    background-color: rgba(43, 48, 54, 0.6);
    position: absolute;
    bottom: 20px;
    left: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    cursor: pointer;
    border: none;
    padding: 0;
`;

export const TagToggleIcon = styled.img`
    width: 11px;
    height: 11px;
`;

export const TagsCenter = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 6;
`;

export const TagsStack = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
`;

export const TagChip = styled.div`
    padding: 6px 15px;
    border-radius: 16px;
    background: rgba(43, 48, 54, 0.6);
    color: #fff;
    font-size: 14px;
    font-weight: 800;
    pointer-events: none;
    white-space: nowrap;
`;

export const CarouselBtn = styled.button<{ $side: "left" | "right" }>`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    ${({ $side }) => ($side === "left" ? "left: 10px;" : "right: 10px;")}

    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.15);
    background: #e4e9e8;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
`;

export const CarouselIcon = styled.img`
    width: 12px;
    height: 12px;
`;

export const Dots = styled.div`
    position: absolute;
    bottom: 10px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    gap: 6px;
`;

export const Dot = styled.button<{ $active: boolean }>`
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
    border: 1px solid rgba(0, 0, 0, 0.35);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
    padding: 0;
    opacity: ${({ $active }) => ($active ? 0.9 : 0.35)};
`;

export const Actions = styled.div`
    padding: 0 12px;
    display: flex;
    gap: 10px;
    margin: 16px 0 0 0;
    font-size: 16px;
    font-weight: 800;
    align-items: center;
`;

export const LikeButton = styled.button`
    border: none;
    background: transparent;
    padding: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
`;

export const LikeIcon = styled.img`
    width: 24px;
    height: 24px;
`;

export const CaptionRow = styled.div`
    padding: 0 12px;
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 16px;
`;

export const HeartOverlay = styled(motion.div)`
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    z-index: 10;
    filter: drop-shadow(0 10px 25px rgba(0, 0, 0, 0.45));
`;

export const HeartOverlayImg = styled(motion.img)`
    width: 200px;
    height: 200px;
`;
