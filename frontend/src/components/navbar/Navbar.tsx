// src/components/navbar/Navbar.tsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import ActiveHomeIcon from "assets/icons/home-active.png";
import ActiveSearchIcon from "assets/icons/search-active.png";
import HomeIcon from "assets/icons/home.png";
import IgIcon from "assets/icons/instagram.png";
import SearchIcon from "assets/icons/search.png";

import { useMediaQuery } from "hooks/useMediaQuery";

import NavItem from "./nav-item/NavItem";
import SearchPanel from "./search-panel/SearchPanel";

import {
    BrandIcon,
    BrandLink,
    BrandText,
    Icon,
    ItemButton,
    Items,
    MOBILE_BREAKPOINT,
    Nav,
    SrOnly,
    WIDE_BREAKPOINT,
    Label,
} from "./Navbar.styles";

const Navbar = () => {
    const isDesktop = useMediaQuery(`(min-width: ${MOBILE_BREAKPOINT}px)`);
    const isWide = useMediaQuery(`(min-width: ${WIDE_BREAKPOINT}px)`);

    const variant = isDesktop ? "left" : "top";

    const [searchOpen, setSearchOpen] = useState(false);

    // Close panel when route changes (feels like IG)
    const location = useLocation();
    useEffect(() => setSearchOpen(false), [location.pathname]);

    return (
        <>
            <Nav $variant={variant} aria-label="Primary">
                <BrandLink to="/" end>
                    <BrandIcon src={IgIcon} alt="Instagram" />
                    {isWide && <BrandText>Amstagrin</BrandText>}
                </BrandLink>

                <Items $variant={variant}>
                    <NavItem
                        variant={variant}
                        to="/"
                        activeIconSrc={ActiveHomeIcon}
                        iconSrc={HomeIcon}
                        label="Home"
                        showLabel={isWide}
                    />

                    <ItemButton
                        $variant={variant}
                        $active={searchOpen}
                        onClick={() => setSearchOpen((v) => !v)}
                        aria-label="Search"
                        aria-expanded={searchOpen}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") setSearchOpen((v) => !v);
                        }}
                    >
                        <Icon
                            src={searchOpen ? ActiveSearchIcon : SearchIcon}
                            alt=""
                            aria-hidden="true"
                        />
                        {isWide && <Label>Search</Label>}
                        <SrOnly>Search</SrOnly>
                    </ItemButton>
                </Items>
            </Nav>

            {/* Panel (desktop style) */}
            {isDesktop && (
                <SearchPanel
                    isWide={isWide}
                    open={searchOpen}
                    onClose={() => setSearchOpen(false)}
                />
            )}
        </>
    );
};

export default Navbar;
