import styled from "styled-components";

export const Bar = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    width: min(520px, calc(100vw - 84px));
    margin-left: 8px;
    justify-content: flex-end;
`;

export const Input = styled.input`
    width: 80%;
    padding: 10px 36px 10px 12px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.06);
    color: #fff;
    outline: none;
    font-size: 14px;

    &::placeholder {
        color: rgba(255, 255, 255, 0.55);
    }
`;

export const ClearButton = styled.button`
    position: absolute;
    right: 8px;
    width: 26px;
    height: 26px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.14);
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
    cursor: pointer;
`;

export const Dropdown = styled.div`
    position: fixed;
    top: 56px; /* navbar height */
    left: 0;
    right: 0;
    z-index: 60;

    background: #0c1013;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
`;

export const HeaderRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 12px 8px 12px;
`;

export const Left = styled.div``;
export const Right = styled.div``;

export const Strong = styled.span`
    font-weight: 900;
`;

export const Pill = styled.button`
    border: none;
    background: transparent;
    color: #7aa7ff;
    cursor: pointer;
    font-weight: 800;
`;

export const EmptyText = styled.div`
    padding: 12px;
    opacity: 0.75;
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

export const ItemLink = styled.a`
    width: 100%;
    display: flex;
    gap: 10px;
    align-items: center;
    text-decoration: none;
    color: #fff;
    padding: 10px 12px;

    &:hover {
        background: rgba(255, 255, 255, 0.06);
        text-decoration: none;
        color: #fff;
    }
`;

export const RemoveButton = styled.button`
    border: none;
    background: transparent;
    color: #aaa;
    cursor: pointer;
    padding: 10px 12px;
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

export const RowSub = styled.div`
    display: flex;
    gap: 6px;
    align-items: center;
    font-size: 13px;
    opacity: 0.7;
`;

export const VerifiedIcon = styled.img`
    width: 16px;
    height: 16px;
`;
