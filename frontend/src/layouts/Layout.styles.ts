// src/layout/Layout.styles.ts
import styled from "styled-components";

const MOBILE_TOP_NAV_HEIGHT = 56;
const DESKTOP_LEFT_NAV_WIDTH = 96; // your current layout spacing
const WIDE_LEFT_NAV_WIDTH = 240;

export const Shell = styled.div`
    min-height: 100dvh;
`;

export const Main = styled.main`
    padding-top: ${MOBILE_TOP_NAV_HEIGHT}px;
    min-height: 100dvh;

    @media (min-width: 775px) {
        padding-top: 0;
        padding-left: ${DESKTOP_LEFT_NAV_WIDTH}px;
    }

    @media (min-width: 1200px) {
        padding-left: ${WIDE_LEFT_NAV_WIDTH}px;
    }
`;

// export these if other components need exact offsets (SearchPanel etc.)
export const layoutConstants = {
    MOBILE_TOP_NAV_HEIGHT,
    DESKTOP_LEFT_NAV_WIDTH,
    WIDE_LEFT_NAV_WIDTH,
};
