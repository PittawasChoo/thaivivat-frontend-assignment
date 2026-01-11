import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import ActiveHomeIcon from "assets/icons/home-active.png";
import ActiveSearchIcon from "assets/icons/search-active.png";
import HomeIcon from "assets/icons/home.png";
import IgIcon from "assets/icons/instagram.png";
import SearchIcon from "assets/icons/search.png";

import { useMediaQuery } from "hooks/useMediaQuery";

import {
    BrandIcon,
    BrandLink,
    BrandText,
    Icon,
    Items,
    Label,
    NavShell,
    SearchToggle,
    SrOnly,
} from "./Navbar.styles";
import NavItem from "./nav-item/NavItem";
import SearchPanel from "./search-panel/SearchPanel";

const MOBILE_BREAKPOINT = 775;
const WIDE_BREAKPOINT = 1200;

export default function Navbar() {
    const isDesktop = useMediaQuery(`(min-width: ${MOBILE_BREAKPOINT}px)`);
    const isWide = useMediaQuery(`(min-width: ${WIDE_BREAKPOINT}px)`);

    const [searchOpen, setSearchOpen] = useState(false);

    const location = useLocation();
    useEffect(() => setSearchOpen(false), [location.pathname]);

    return (
        <>
            <NavShell $variant={isDesktop ? "left" : "top"} aria-label="Primary">
                <BrandLink to="/" end>
                    <BrandIcon src={IgIcon} alt="Instagram" />
                    {isWide && <BrandText>Amstagrin</BrandText>}
                </BrandLink>

                <Items $variant={isDesktop ? "left" : "top"}>
                    <NavItem
                        variant={isDesktop ? "left" : "top"}
                        to="/"
                        label="Home"
                        iconSrc={HomeIcon}
                        activeIconSrc={ActiveHomeIcon}
                        showLabel={isWide}
                    />

                    <SearchToggle
                        type="button"
                        data-search-toggle="true"
                        $active={searchOpen}
                        onClick={() => setSearchOpen((v) => !v)}
                        aria-label="Search"
                        aria-expanded={searchOpen}
                    >
                        <Icon
                            src={searchOpen ? ActiveSearchIcon ?? SearchIcon : SearchIcon}
                            alt=""
                            aria-hidden="true"
                        />
                        {isWide && <Label>Search</Label>}
                        <SrOnly>Search</SrOnly>
                    </SearchToggle>
                </Items>
            </NavShell>

            {/* Panel (desktop only) */}
            {isDesktop && (
                <SearchPanel
                    isWide={isWide}
                    open={searchOpen}
                    onClose={() => setSearchOpen(false)}
                />
            )}
        </>
    );
}
