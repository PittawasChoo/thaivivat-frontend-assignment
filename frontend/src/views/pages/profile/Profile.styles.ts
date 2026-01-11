// src/pages/profile/Profile.styles.ts
import styled from "styled-components";

export const Page = styled.div`
    max-width: 935px;
    margin: 0 auto;
    padding: 16px 12px;
    color: #fff;

    @media (max-width: 360px) {
        padding: 12px 10px;
    }
`;

export const Header = styled.div`
    display: flex;
    gap: 28px;
    align-items: center;
    padding: 12px 0 18px;

    @media (max-width: 420px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 14px;
    }
`;

export const HeaderRight = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
`;

export const TopRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;

    @media (max-width: 420px) {
        width: 100%;
        justify-content: flex-start;
    }
`;

export const UsernameRow = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
`;

export const Username = styled.div`
    font-size: 22px;
    font-weight: 800;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    @media (max-width: 420px) {
        max-width: 220px; /* prevents overflow on tiny screens */
    }
`;

export const VerifiedIcon = styled.img`
    width: 16px;
    height: 16px;
`;

export const Actions = styled.div`
    display: flex;
    gap: 8px;

    @media (max-width: 420px) {
        width: 100%;
    }
`;

export const PrimaryButton = styled.button`
    padding: 8px 12px;
    border-radius: 10px;
    border: none;
    background: #2d6cff;
    color: #fff;
    font-weight: 800;
    cursor: pointer;

    @media (max-width: 420px) {
        flex: 1;
    }
`;

export const SecondaryButton = styled.button`
    padding: 8px 12px;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.16);
    background: transparent;
    color: #fff;
    font-weight: 800;
    cursor: pointer;

    @media (max-width: 420px) {
        flex: 1;
    }
`;

export const Name = styled.div`
    text-align: start;
    font-size: 14px;
`;

export const Stats = styled.div`
    display: flex;
    gap: 18px;
    font-size: 14px;
    flex-wrap: wrap;

    b {
        font-weight: 900;
    }

    @media (max-width: 420px) {
        gap: 10px 14px;
    }
`;

export const Divider = styled.div`
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
    margin: 12px 0 18px;
`;

export const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 4px;
    padding-bottom: 32px;
`;

export const GridItem = styled.div`
    aspect-ratio: 1 / 1;
    overflow: hidden;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.06);
`;

export const GridImg = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    user-select: none;
    pointer-events: none; /* ✅ no click effects */
`;

export const EmptyBox = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.7;
    font-size: 12px;
`;

export const EmptyState = styled.div`
    margin-top: 16px;
    opacity: 0.7;
`;
