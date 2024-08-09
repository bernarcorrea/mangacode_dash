import Link from "next/link";
import React from "react";
import Icon from "./Icon";

const SubmenuLink = ({ title, href, setShowMenuTitle, setSubmenuLinks }) => {
    const onClickFunction = () => {
        setSubmenuLinks([]);
        setShowMenuTitle(false);
    };

    return (
        <Link
            onClick={onClickFunction}
            href={href}
            alt={title}
            className="
                flex 
                items-center
                py-2
                px-4
                text-sm
                border-b
                border-zinc-100
                text-zinc-800 
                hover:text-rose-500
            "
        >
            <Icon name="ChevronRight" size={14} />
            <span>{title}</span>
        </Link>
    );
};

export default SubmenuLink;
