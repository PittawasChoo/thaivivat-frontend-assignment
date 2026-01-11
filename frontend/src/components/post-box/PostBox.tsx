import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import Heart from "assets/icons/heart-outline.png";
import LeftArrow from "assets/icons/left-arrow.png";
import RedHeart from "assets/icons/heart-red.png";
import RightArrow from "assets/icons/right-arrow.png";
import UserIcon from "assets/icons/user.png";
import Verified from "assets/icons/verified.png";

import ProfileHoverCard from "components/profile-hover-card/ProfileHoverCard";
import ProfileImage from "components/profile-image/ProfileImage";

import type { PostWithRelations } from "types/post";

import { formatPostTime } from "utils/time";
import { formatToShortNumber } from "utils/number";

import {
    Actions,
    CaptionRow,
    Card,
    CarouselBtn,
    CarouselIcon,
    Dot,
    Dots,
    HeaderRow,
    HeartOverlay,
    HeartOverlayImg,
    ImageContainer,
    LikeButton,
    LikeIcon,
    LocationText,
    PostImage,
    Slide,
    TagChip,
    TagToggle,
    TagToggleIcon,
    TagsCenter,
    TagsStack,
    TimeRow,
    Track,
    UserMeta,
    UserTop,
    Username,
    VerifiedIcon,
} from "./PostBox.styles";
import { loadImageSize } from "./utils/caching";

type PostBoxProps = {
    post: PostWithRelations;
    onToggleLike: (postId: number) => void;
};

const PostBox = ({ post, onToggleLike }: PostBoxProps) => {
    const navigate = useNavigate();

    const urls = post.imageUrls ?? [];
    const hasMultiple = urls.length > 1;

    const [activeImage, setActiveImage] = useState(0);
    useEffect(() => setActiveImage(0), [post.id]);

    const [openTagsIndex, setOpenTagsIndex] = useState<number | null>(null);
    useEffect(() => setOpenTagsIndex(null), [post.id, activeImage]);

    const resetTags = () => setOpenTagsIndex(null);
    const toggleShowTags = (imageIndex: number) => {
        setOpenTagsIndex((prev) => (prev === imageIndex ? null : imageIndex));
    };

    // load image sizes
    const [sizes, setSizes] = useState<{ w: number; h: number }[]>([]);
    useEffect(() => {
        let cancel = false;
        Promise.all(urls.map(loadImageSize))
            .then((r) => !cancel && setSizes(r))
            .catch(() => {});
        return () => {
            cancel = true;
        };
    }, [urls]);

    const height = useMemo(() => {
        const hasPortrait = sizes.some((s) => s.h > s.w);
        return hasPortrait ? 650 : 468;
    }, [sizes]);

    const isPortraitByIndex = useMemo(() => sizes.map((s) => s.h > s.w), [sizes]);

    const [likePulse, setLikePulse] = useState(false);
    const prevLikedRef = useRef(post.liked);

    useEffect(() => {
        const prev = prevLikedRef.current;
        prevLikedRef.current = post.liked;

        if (!prev && post.liked) {
            setLikePulse(true);
            const t = window.setTimeout(() => setLikePulse(false), 1000);
            return () => window.clearTimeout(t);
        }
    }, [post.liked]);

    return (
        <Card>
            <HeaderRow>
                <ProfileHoverCard user={post.user}>
                    <ProfileImage user={post.user} width={50} height={50} />
                </ProfileHoverCard>

                <UserMeta>
                    <UserTop>
                        <ProfileHoverCard user={post.user}>
                            <Username onClick={() => navigate(`/profile/${post.user.username}`)}>
                                {post.user.username}
                            </Username>
                        </ProfileHoverCard>

                        {post.user.isVerified && (
                            <VerifiedIcon
                                src={Verified}
                                alt="Verified Account"
                                aria-hidden="true"
                            />
                        )}

                        {post.createdAt && (
                            <TimeRow>
                                <span>•</span>
                                <span>{formatPostTime(post.createdAt)}</span>
                            </TimeRow>
                        )}
                    </UserTop>

                    {post.location?.name && <LocationText>{post.location.name}</LocationText>}
                </UserMeta>
            </HeaderRow>

            <ImageContainer $height={height}>
                <Track $active={activeImage}>
                    {urls.map((src, i) => {
                        const isPortrait = isPortraitByIndex[i] ?? false;
                        const tags = post.allTags?.[i] ?? [];

                        return (
                            <Slide key={src}>
                                <AnimatePresence mode="wait">
                                    {likePulse && i === activeImage && (
                                        <HeartOverlay
                                            key={`heart-${post.id}-${activeImage}`}
                                            initial={{ opacity: 0, scale: 0.85 }}
                                            animate={{ opacity: 1, scale: 1.1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.35, ease: "easeOut" }}
                                        >
                                            <HeartOverlayImg
                                                src={RedHeart}
                                                alt=""
                                                aria-hidden="true"
                                                animate={{
                                                    scale: [1, 1.05, 1],
                                                    opacity: [1, 1, 0],
                                                }}
                                                transition={{ duration: 1.0, times: [0, 0.3, 1] }}
                                            />
                                        </HeartOverlay>
                                    )}
                                </AnimatePresence>

                                <PostImage
                                    src={src}
                                    alt={post.caption}
                                    $portrait={isPortrait}
                                    onClick={() => toggleShowTags(i)}
                                    onDoubleClick={() => onToggleLike(post.id)}
                                />

                                {tags.length > 0 && (
                                    <TagToggle
                                        onClick={() => toggleShowTags(i)}
                                        aria-label="Toggle tags"
                                    >
                                        <TagToggleIcon src={UserIcon} alt="" aria-hidden="true" />
                                    </TagToggle>
                                )}

                                <AnimatePresence mode="wait">
                                    {openTagsIndex === i && tags.length > 0 && (
                                        <TagsCenter onClick={resetTags}>
                                            <motion.div
                                                key={`tags-${post.id}-${i}`}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <TagsStack>
                                                    {tags.map((tag) => (
                                                        <motion.div
                                                            key={tag}
                                                            initial={{ y: 6, opacity: 0 }}
                                                            animate={{ y: 0, opacity: 1 }}
                                                            exit={{ y: 6, opacity: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            <TagChip>{tag}</TagChip>
                                                        </motion.div>
                                                    ))}
                                                </TagsStack>
                                            </motion.div>
                                        </TagsCenter>
                                    )}
                                </AnimatePresence>
                            </Slide>
                        );
                    })}
                </Track>

                {hasMultiple && (
                    <>
                        {activeImage > 0 && (
                            <CarouselBtn
                                $side="left"
                                onClick={() => {
                                    resetTags();
                                    setActiveImage((v) => v - 1);
                                }}
                                aria-label="Previous image"
                            >
                                <CarouselIcon src={LeftArrow} alt="" aria-hidden="true" />
                            </CarouselBtn>
                        )}

                        {activeImage < urls.length - 1 && (
                            <CarouselBtn
                                $side="right"
                                onClick={() => {
                                    resetTags();
                                    setActiveImage((v) => v + 1);
                                }}
                                aria-label="Next image"
                            >
                                <CarouselIcon src={RightArrow} alt="" aria-hidden="true" />
                            </CarouselBtn>
                        )}

                        <Dots>
                            {urls.map((_, i) => (
                                <Dot
                                    key={i}
                                    $active={i === activeImage}
                                    onClick={() => setActiveImage(i)}
                                    aria-label={`Go to image ${i + 1}`}
                                />
                            ))}
                        </Dots>
                    </>
                )}
            </ImageContainer>

            <Actions>
                <LikeButton onClick={() => onToggleLike(post.id)} aria-label="Like">
                    <LikeIcon src={post.liked ? RedHeart : Heart} alt="" aria-hidden="true" />
                </LikeButton>

                <span>{formatToShortNumber(post.likesCount)} likes</span>
            </Actions>

            <CaptionRow>
                <ProfileHoverCard user={post.user}>
                    <Username onClick={() => navigate(`/profile/${post.user.username}`)}>
                        {post.user.username}
                    </Username>
                </ProfileHoverCard>

                {post.user.isVerified && (
                    <VerifiedIcon src={Verified} alt="Verified Account" aria-hidden="true" />
                )}

                <div>{post.caption}</div>
            </CaptionRow>
        </Card>
    );
};

export default PostBox;
