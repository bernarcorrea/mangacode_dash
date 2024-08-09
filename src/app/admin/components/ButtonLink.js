import Link from "next/link";
import React from "react";
import Icon from "./Icon";

const ButtonLink = ({ title, href, color, size, icon, onClick = null }) => {
    let spacing = null;

    if (icon && !title) {
        spacing = size == "small" ? "w-8 h-8" : size == "larger" ? "w-14 h-14" : "w-12 h-12";
    } else {
        spacing = size == "small" ? "px-4 py-2" : size == "larger" ? "px-8 py-4" : "px-6 py-3";
    }

    const fontSize = size == "small" ? "text-sm" : size == "larger" ? "text-lg" : "text-base";
    const iconSize = size == "small" ? 12 : size == "larger" ? 20 : 15;

    return (
        <Link
            onClick={onClick}
            href={href ? href : "#"}
            className={`
                ${spacing} 
                ${fontSize} 
                ${color} 
                flex 
                items-center 
                justify-center 
                gap-1 
                rounded-full 
                hover:bg-opacity-90
            `}
        >
            {icon && <Icon name={icon} size={iconSize} />}
            {title && <span>{title}</span>}
        </Link>
    );
};

export default ButtonLink;
