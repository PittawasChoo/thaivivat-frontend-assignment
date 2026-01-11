import styled, { css } from "styled-components";

export const Container = styled.div<{
    $width: number;
    $height: number;
    $hasStory: boolean;
    $clickable: boolean;
}>`
    width: ${({ $width }) => `${$width}px`};
    height: ${({ $height }) => `${$height}px`};
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    ${({ $clickable }) =>
        $clickable &&
        css`
            cursor: pointer;
        `}

    ${({ $hasStory }) =>
        $hasStory &&
        css`
            background-image: linear-gradient(
                45deg,
                #ffa95f 5%,
                #f47838 15%,
                #d92d7a 70%,
                #962fbf 80%,
                #4f5bd5 95%
            );
        `}
`;

export const Avatar = styled.img<{ $width: number; $height: number }>`
    width: ${({ $width }) => `${$width}px`};
    height: ${({ $height }) => `${$height}px`};
    border-radius: 50%;
    border: 4px solid #121b21;
    object-fit: cover;
`;
