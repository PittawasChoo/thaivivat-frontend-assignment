import styled from "styled-components";

export const Message = styled.div<{ variant: "info" | "error" }>`
    text-align: center;
    opacity: 0.9;
    padding: 10px 14px;
    border-radius: 999px;
    background: rgba(20, 20, 20, 0.85);
    border: 1px solid rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(8px);
    margin: 8px auto;
    width: fit-content;

    color: ${({ variant }) => (variant === "error" ? "salmon" : "#ffffff")};
`;

export const LoadingRow = styled.div`
    display: flex;
    justify-content: center;
`;

export const SpinnerContainer = styled.div`
    margin-left: 18px;
    margin-top: 10px;
`;
