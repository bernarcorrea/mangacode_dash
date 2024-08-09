import Link from "next/link";
import React from "react";
import Icon from "./Icon";

const MenuLink = ({
    title,
    href,
    icon,
    showMenuTitle,
    setShowMenuTitle,
    submenuLinks,
    setSubmenuLinks,
    setSubmenuTitle,
    onClick,
}) => {
    const handleViewSubmenu = () => {
        setSubmenuLinks(submenuLinks);
        setSubmenuTitle(title);
    };

    const handleRedirectLink = () => {
        setSubmenuLinks([]);
        setSubmenuTitle("");
        setShowMenuTitle(false);
    };

    let onClickFunction;
    if (!onClick) {
        onClickFunction = submenuLinks ? handleViewSubmenu : handleRedirectLink;
    } else {
        onClickFunction = onClick;
    }

    return (
        <Link
            onClick={onClickFunction}
            href={!href ? "#" : href}
            alt={title}
            className="
                relative
                flex 
                items-center 
                gap-3 
                text-white 
                text-opacity-80 
                hover:text-opacity-100
            "
        >
            <Icon name={icon} size={25} />
            {showMenuTitle && <span>{title}</span>}
        </Link>
    );
};

export default MenuLink;
