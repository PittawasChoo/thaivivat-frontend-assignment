import styled from "styled-components";
import { NavLink } from "react-router-dom";

export const NavShell = styled.nav<{ $variant: "top" | "left" }>`
    position: fixed;
    background: #0c1013;
    z-index: 50;
    display: flex;

    border-color: rgba(200, 200, 200, 0.3);

    ${({ $variant }) =>
        $variant === "top"
            ? `
                top: 0;
                left: 0;
                right: 0;
                height: 56px;
                padding: 0 12px;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            `
            : `
                top: 0;
                left: 0;
                bottom: 0;
                width: 72px;
                padding: 16px 12px;
                flex-direction: column;
                border-right: 1px solid rgba(255, 255, 255, 0.08);
            `}

    @media (min-width: 1200px) {
        ${({ $variant }) => ($variant === "left" ? `width: 240px;` : ``)}
    }
`;

export const BrandLink = styled(NavLink)`
    display: flex;
    align-items: center;
    gap: 10px;
    height: 40px;
    margin: 10px 0 32px 12px;
    text-decoration: none;
    color: white;
`;

export const BrandIcon = styled.img`
    width: 22px;
    height: 22px;
`;

export const BrandText = styled.span`
    font-size: 18px;
    font-weight: 700;
`;

export const Items = styled.div<{ $variant: "top" | "left" }>`
    display: flex;
    gap: 6px;

    ${({ $variant }) =>
        $variant === "top"
            ? `
    flex-direction: row;
    align-items: center;
  `
            : `
    margin-top: 16px;
    flex-direction: column;
  `}
`;

export const SearchToggle = styled.button<{ $active: boolean }>`
    width: 100%;
    display: inline-flex;
    align-items: center;
    gap: 12px;
    height: 44px;
    border-radius: 12px;
    color: rgba(255, 255, 255, 0.9);
    cursor: pointer;
    background: transparent;
    border: none;
    padding: 0;
    text-align: left;
    font-weight: ${({ $active }) => ($active ? 700 : 400)};

    &:hover {
        background: rgba(255, 255, 255, 0.06);
    }

    /* top layout padding */
    @media (max-width: 774px) {
        padding: 0 10px;
    }
`;

export const Icon = styled.img`
    width: 24px;
    height: 24px;
    margin-left: 12px;
`;

export const Label = styled.span`
    font-size: 18px;
`;

export const SrOnly = styled.span`
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
`;
