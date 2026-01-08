import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";

// Assume you will replace these with your real assets later
import HomeIcon from "../../assets/icons/home.png";
import SearchIcon from "../../assets/icons/search.png";
import IgIcon from "../../assets/icons/instagram.png";
import { useMediaQuery } from "../../hooks/useMediaQuery";

const MOBILE_BREAKPOINT = 775;
const WIDE_BREAKPOINT = 1200;

export default function Navbar() {
  const isDesktop = useMediaQuery(`(min-width: ${MOBILE_BREAKPOINT}px)`);
  const isWide = useMediaQuery(`(min-width: ${WIDE_BREAKPOINT}px)`);

  const variantClass = isDesktop ? styles.left : styles.top;

  return (
    <nav className={`${styles.nav} ${variantClass}`} aria-label="Primary">
      <div className={styles.brand}>
        <img className={styles.brandIcon} src={IgIcon} alt="Instagram" />
        {isWide && <span className={styles.brandText}>Instagram</span>}
      </div>

      <div className={styles.items}>
        <NavItem to="/" iconSrc={HomeIcon} label="Home" showLabel={isWide} />
        <NavItem
          to="/search"
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
  iconSrc,
  label,
  showLabel,
}: {
  to: string;
  iconSrc: string;
  label: string;
  showLabel: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        `${styles.item} ${isActive ? styles.active : ""}`
      }
    >
      <img className={styles.icon} src={iconSrc} alt="" aria-hidden="true" />
      {showLabel && <span className={styles.label}>{label}</span>}
      <span className={styles.srOnly}>{label}</span>
    </NavLink>
  );
}
