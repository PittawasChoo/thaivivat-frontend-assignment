import { Outlet } from "react-router-dom";

import Navbar from "components/navbar/Navbar";

import { Main, Shell } from "./Layout.styles";

export default function Layout() {
    return (
        <Shell>
            <Navbar />
            <Main>
                <Outlet />
            </Main>
        </Shell>
    );
}
