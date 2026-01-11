import { styled } from "styled-components";
import { NavLink } from "react-router-dom";

export const Backdrop = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
    z-index: 9;
`;

export const Panel = styled.div<{ $left: number }>`
    position: fixed;
    top: 0;
    left: ${({ $left }) => $left}px;
    height: 100vh;
    width: 420px;
    background: #0c1013;
    border-right: 1px solid rgba(255, 255, 255, 0.08);
    z-index: 10;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

export const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
`;

export const Title = styled.div`
    font-size: 22px;
    font-weight: 900;
`;

export const CloseButton = styled.button`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.15);
    background: rgba(255, 255, 255, 0.06);
    color: #fff;
    cursor: pointer;
`;

export const SearchBar = styled.div`
    position: relative;
    width: 100%;
    padding: 16px 16px 12px 16px;
`;

export const Input = styled.input`
    width: 100%;
    padding: 12px 40px 12px 14px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.06);
    color: #fff;
    outline: none;
    font-size: 14px;
`;

export const ClearButton = styled.button`
    position: absolute;
    right: 26px;
    top: 50%;
    transform: translateY(-50%);
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.15);
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
    cursor: pointer;
`;

export const Body = styled.div`
    flex: 1;
    overflow: auto;
`;

export const RecentsHeader = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 12px 0;
`;

export const RecentsTitle = styled.div`
    font-weight: 900;
    padding: 0 16px;
`;

export const ClearAllButton = styled.button`
    border: none;
    background: transparent;
    color: #7aa7ff;
    cursor: pointer;
    font-weight: 800;
    padding: 0 16px;
`;

export const EmptyText = styled.div`
    opacity: 0.7;
    padding: 12px 16px;
    color: #fff;
`;

export const ErrorBox = styled.div`
    margin: 0 16px;
    padding: 12px;
    border-radius: 12px;
    background: rgba(255, 0, 0, 0.08);
    color: #fff;
`;

export const List = styled.div`
    display: flex;
    flex-direction: column;
`;

export const RecentRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

export const RowLink = styled(NavLink)`
    width: 100%;
    display: flex;
    gap: 10px;
    align-items: center;
    text-decoration: none;
    color: #fff;
    padding: 12px 24px;

    &:hover {
        background: rgba(255, 255, 255, 0.06);
        text-decoration: none;
        color: #fff;
    }
`;

export const ResultLink = styled(NavLink)`
    width: 100%;
    display: flex;
    gap: 10px;
    align-items: center;
    text-decoration: none;
    color: #fff;
    padding: 12px 24px;

    &:hover {
        background: rgba(255, 255, 255, 0.06);
        text-decoration: none;
        color: #fff;
    }
`;

export const RowText = styled.div`
    display: flex;
    flex-direction: column;
    min-width: 0;
`;

export const RowTop = styled.div`
    display: flex;
    gap: 6px;
    align-items: center;
    min-width: 0;
`;

export const Strong = styled.span`
    font-weight: 900;
`;

export const VerifiedIcon = styled.img`
    width: 16px;
    height: 16px;
`;

export const RowSub = styled.div`
    font-size: 14px;
    opacity: 0.7;
    text-align: left;
    gap: 4px;
    display: flex;
    align-items: center;
`;

export const Dot = styled.span``;

export const RemoveButton = styled.button`
    border: none;
    background: transparent;
    color: #aaa;
    cursor: pointer;
    padding: 12px 24px;
`;
