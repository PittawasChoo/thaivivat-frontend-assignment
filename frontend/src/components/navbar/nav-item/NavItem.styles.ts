import styled, { css } from "styled-components";
import { NavLink } from "react-router-dom";

export const NavLinkFull = styled(NavLink)`
    text-align: start;
    width: 100%;
    text-decoration: none;
`;

export const ItemButton = styled.div<{ $variant: "top" | "left"; $active?: boolean }>`
    width: 100%;
    display: inline-flex;
    align-items: center;
    gap: 12px;
    height: 44px;
    border-radius: 12px;
    color: rgba(255, 255, 255, 0.9);
    text-decoration: none;
    cursor: pointer;
    position: relative;

    ${({ $variant }) =>
        $variant === "top"
            ? css`
                  padding: 0 10px;
              `
            : css`
                  padding: 0;
              `}

    ${({ $active }) =>
        $active &&
        css`
            font-weight: 700;
        `}

  &:hover {
        background: rgba(255, 255, 255, 0.06);
    }
`;
