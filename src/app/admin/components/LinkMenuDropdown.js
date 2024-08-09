import React from "react";
import Icon from "./Icon";

const LinkMenuDropdown = ({ title, href, icon, onClick }) => {
    return (
        <li className="text-sm text-zinc-400 font-normal hover:text-rose-400">
            <a href={href} onClick={onClick} className="flex items-center gap-2 p-3 border-b border-zinc-100">
                <Icon name={icon} size={16} />
                {title}
            </a>
        </li>
    );
};

export default LinkMenuDropdown;
