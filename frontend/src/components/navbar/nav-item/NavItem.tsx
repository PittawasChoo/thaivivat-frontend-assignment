import { NavLinkFull } from "./NavItem.styles";

import { Icon, ItemButton, SrOnly, Label } from "../Navbar.styles";

type NavItemProps = {
    variant: "top" | "left";
    to: string;
    activeIconSrc: string;
    iconSrc: string;
    label: string;
    showLabel: boolean;
};

const NavItem = ({ variant, to, activeIconSrc, iconSrc, label, showLabel }: NavItemProps) => {
    return (
        <NavLinkFull to={to} end={to === "/"}>
            {({ isActive }) => (
                <ItemButton $variant={variant} $active={isActive}>
                    <Icon src={isActive ? activeIconSrc : iconSrc} alt="" aria-hidden="true" />
                    {showLabel && <Label>{label}</Label>}
                    <SrOnly>{label}</SrOnly>
                </ItemButton>
            )}
        </NavLinkFull>
    );
};

export default NavItem;
