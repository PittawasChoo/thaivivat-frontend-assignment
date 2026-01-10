import { NavLink } from "react-router-dom";

import ActiveHomeIcon from "assets/icons/home-active.png";
import ActiveSearchIcon from "assets/icons/search-active.png";
import HomeIcon from "assets/icons/home.png";
import IgIcon from "assets/icons/instagram.png";
import SearchIcon from "assets/icons/search.png";

import { useMediaQuery } from "hooks/useMediaQuery";

import styles from "./Navbar.module.css";

const MOBILE_BREAKPOINT = 775;
const WIDE_BREAKPOINT = 1200;

export default function Navbar() {
    const isDesktop = useMediaQuery(`(min-width: ${MOBILE_BREAKPOINT}px)`);
    const isWide = useMediaQuery(`(min-width: ${WIDE_BREAKPOINT}px)`);

    const variantClass = isDesktop ? styles.left : styles.top;

    return (
        <nav className={`${styles.nav} ${variantClass}`} aria-label="Primary">
            <NavLink
                to="/"
                end={true}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    height: "40px",
                    margin: "10px 0 32px 12px",
                    textDecoration: "none",
                    color: "white",
                }}
            >
                <img className={styles.brandIcon} src={IgIcon} alt="Instagram" />
                {isWide && <span className={styles.brandText}>Instagram</span>}
            </NavLink>

            <div className={styles.items}>
                <NavItem
                    to="/"
                    activeIconSrc={ActiveHomeIcon}
                    iconSrc={HomeIcon}
                    label="Home"
                    showLabel={isWide}
                />
                <NavItem
                    to="/search"
                    activeIconSrc={ActiveSearchIcon}
                    iconSrc={SearchIcon}
                    label="Search"
                    showLabel={isWide}
                />
            </div>
        </nav>
    );
}

function NavItem({
    to,
    activeIconSrc,
    iconSrc,
    label,
    showLabel,
}: {
    to: string;
    activeIconSrc: string;
    iconSrc: string;
    label: string;
    showLabel: boolean;
}) {
    return (
        <NavLink to={to} end={to === "/"} style={{ textAlign: "start", width: "100%" }}>
            {({ isActive }) => (
                <div className={`${styles.item} ${isActive ? styles.active : ""}`}>
                    <img
                        className={styles.icon}
                        src={isActive ? activeIconSrc : iconSrc}
                        alt={`${label}-icon`}
                        aria-hidden="true"
                    />
                    {showLabel && <span className={styles.label}>{label}</span>}
                    <span className={styles.srOnly}>{label}</span>
                </div>
            )}
        </NavLink>
    );
}
