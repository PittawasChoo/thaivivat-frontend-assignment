import styled from "styled-components";

export const Wrap = styled.div`
    min-height: calc(100dvh - 56px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 12px;
    color: #fff;
`;

export const ErrorContainer = styled.div`
    width: min(560px, 100%);
`;

export const Title = styled.h2`
    margin: 0 0 10px 0;
    font-size: 20px;
    font-weight: 900;
`;

export const Desc = styled.p`
    margin: 0;
    opacity: 0.8;
    line-height: 1.4;
`;

export const Actions = styled.div`
    display: flex;
    gap: 10px;
    margin-top: 14px;
    flex-wrap: wrap;
    justify-content: center;
`;

export const PrimaryBtn = styled.button`
    padding: 10px 12px;
    border-radius: 10px;
    border: none;
    background: #2d6cff;
    color: #fff;
    font-weight: 800;
    cursor: pointer;
`;

export const GhostBtn = styled.button`
    padding: 10px 12px;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.16);
    background: transparent;
    color: #fff;
    font-weight: 800;
    cursor: pointer;
`;
