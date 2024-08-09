import React from "react";
import Icon from "./Icon";
import SitemapPage from "./SitemapPage";

const HeaderPage = ({ title, icon, sitemap }) => {
    return (
        <div className="flex flex-col gap-2">
            <h2 className="flex items-center gap-2 text-3xl font-semibold text-gray-900">
                <Icon name={icon} size={28} />
                <span>{title}</span>
            </h2>
            <SitemapPage sitemap={sitemap} />
        </div>
    );
};

export default HeaderPage;
