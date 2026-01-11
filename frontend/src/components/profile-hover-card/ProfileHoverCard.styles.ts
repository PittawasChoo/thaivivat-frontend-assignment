import styled from "styled-components";

export const Anchor = styled.span`
    display: inline-flex;
`;

export const Card = styled.div<{ $top: number; $left: number }>`
    position: fixed;
    top: ${({ $top }) => `${$top}px`};
    left: ${({ $left }) => `${$left}px`};
    width: 320px;
    padding: 14px;
    border-radius: 14px;
    background: rgba(18, 20, 24, 0.98);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 18px 50px rgba(0, 0, 0, 0.45);
    z-index: 9999;
    color: #fff;
    backdrop-filter: blur(10px);
`;

export const TopRow = styled.div`
    display: flex;
    gap: 12px;
    align-items: center;
`;

export const NameBlock = styled.div`
    min-width: 0;
`;

export const UsernameRow = styled.div`
    min-width: 0;
    display: flex;
    gap: 5px;
    align-items: center;
`;

export const Username = styled.span`
    font-size: 16px;
    font-weight: 800;
`;

export const VerifiedIcon = styled.img`
    width: 16px;
    height: 16px;
`;

export const FullName = styled.div`
    opacity: 0.8;
    font-size: 13px;
`;

export const StatsRow = styled.div`
    margin-top: 12px;
    display: flex;
    justify-content: space-around;
`;

export const Stat = styled.div`
    text-align: center;
    width: 20%;
`;

export const StatValue = styled.p`
    margin: 0;
    line-height: 16px;
    font-weight: 800;
`;

export const StatLabel = styled.p`
    margin: 0;
    font-size: 13px;
`;

export const Actions = styled.div`
    margin-top: 12px;
    display: flex;
    gap: 8px;
`;

export const PrimaryButton = styled.button`
    width: 100%;
    padding: 8px 12px;
    border-radius: 10px;
    border: none;
    background: #2d6cff;
    color: #fff;
    font-weight: 800;
    cursor: pointer;
`;
