import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

import Verified from "assets/icons/verified.png";

import ProfileImage from "components/profile-image/ProfileImage";

import type { User } from "types/user";

import { formatToShortNumber } from "utils/number";

import {
    Actions,
    Anchor,
    Card,
    FullName,
    NameBlock,
    PrimaryButton,
    Stat,
    StatLabel,
    StatsRow,
    StatValue,
    TopRow,
    Username,
    UsernameRow,
    VerifiedIcon,
} from "./ProfileHoverCard.styles";

type ProfileHoverCardProps = {
    user: User;
    children: React.ReactNode; // the thing you hover (username / avatar)
    renderCard?: (user: User) => React.ReactNode; // optional custom UI
    openDelayMs?: number;
    closeDelayMs?: number;
};

const ProfileHoverCard = ({
    user,
    children,
    renderCard,
    openDelayMs = 150,
    closeDelayMs = 120,
}: ProfileHoverCardProps) => {
    const navigate = useNavigate();

    const anchorRef = useRef<HTMLSpanElement | null>(null);
    const cardRef = useRef<HTMLDivElement | null>(null);

    const openTimer = useRef<number | null>(null);
    const closeTimer = useRef<number | null>(null);

    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

    const clearTimers = () => {
        if (openTimer.current) window.clearTimeout(openTimer.current);
        if (closeTimer.current) window.clearTimeout(closeTimer.current);
        openTimer.current = null;
        closeTimer.current = null;
    };

    const computePosition = () => {
        const el = anchorRef.current;
        if (!el) return;

        const r = el.getBoundingClientRect();
        const width = 320;
        const gap = 10;

        let left = r.left;
        let top = r.bottom + gap;

        const maxLeft = window.innerWidth - width - 10;
        left = Math.max(10, Math.min(left, maxLeft));

        const estimatedHeight = 220;
        if (top + estimatedHeight > window.innerHeight) {
            top = r.top - gap - estimatedHeight;
        }
        top = Math.max(10, top);

        setPos({ top, left });
    };

    const openWithDelay = () => {
        clearTimers();
        openTimer.current = window.setTimeout(() => {
            computePosition();
            setOpen(true);
        }, openDelayMs);
    };

    const closeWithDelay = () => {
        clearTimers();
        closeTimer.current = window.setTimeout(() => setOpen(false), closeDelayMs);
    };

    // Reposition on open + on scroll/resize
    useLayoutEffect(() => {
        if (!open) return;

        computePosition();

        const onScroll = () => computePosition();
        const onResize = () => computePosition();
        window.addEventListener("scroll", onScroll, true);
        window.addEventListener("resize", onResize);

        return () => {
            window.removeEventListener("scroll", onScroll, true);
            window.removeEventListener("resize", onResize);
        };
    }, [open]);

    // close on Escape
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    // close on click outside
    useEffect(() => {
        if (!open) return;
        const onDown = (e: MouseEvent) => {
            const a = anchorRef.current;
            const c = cardRef.current;
            if (!a || !c) return;
            const t = e.target as Node;
            if (!a.contains(t) && !c.contains(t)) setOpen(false);
        };
        window.addEventListener("mousedown", onDown);
        return () => window.removeEventListener("mousedown", onDown);
    }, [open]);

    const defaultCard = (
        <>
            <TopRow>
                <ProfileImage user={user} width={60} height={60} />

                <NameBlock>
                    <UsernameRow>
                        <Username>{user.username}</Username>
                        {user.isVerified && (
                            <VerifiedIcon
                                src={Verified}
                                alt="Verified Account"
                                aria-hidden="true"
                            />
                        )}
                    </UsernameRow>

                    {user.name && <FullName>{user.name}</FullName>}
                </NameBlock>
            </TopRow>

            <StatsRow>
                <Stat>
                    <StatValue>{formatToShortNumber(user.postsCount)}</StatValue>
                    <StatLabel>posts</StatLabel>
                </Stat>

                <Stat>
                    <StatValue>{formatToShortNumber(user.followersCount)}</StatValue>
                    <StatLabel>followers</StatLabel>
                </Stat>

                <Stat>
                    <StatValue>{formatToShortNumber(user.followingsCount)}</StatValue>
                    <StatLabel>following</StatLabel>
                </Stat>
            </StatsRow>

            <Actions>
                <PrimaryButton onClick={() => navigate(`/profile/${user.username}`)}>
                    View Profile
                </PrimaryButton>
            </Actions>
        </>
    );

    return (
        <>
            <Anchor
                ref={anchorRef}
                onMouseEnter={openWithDelay}
                onMouseLeave={closeWithDelay}
                onFocus={openWithDelay}
                onBlur={closeWithDelay}
            >
                {children}
            </Anchor>

            {open &&
                createPortal(
                    <Card
                        ref={cardRef}
                        $top={pos.top}
                        $left={pos.left}
                        onMouseEnter={() => {
                            clearTimers();
                        }}
                        onMouseLeave={closeWithDelay}
                        role="dialog"
                        aria-label={`Profile preview for ${user.username}`}
                    >
                        {renderCard ? renderCard(user) : defaultCard}
                    </Card>,
                    document.body
                )}
        </>
    );
};

export default ProfileHoverCard;
