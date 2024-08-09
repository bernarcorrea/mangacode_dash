import { ChevronRight } from "lucide-react";
import React from "react";

const SitemapPage = ({ sitemap }) => {
    const className = "text-xs uppercase font-light text-zinc-400 hover:text-rose-500";

    return (
        <nav>
            <ul className="flex items-center gap-1">
                <li className={className}>
                    <a href="/admin">Dashboard</a>
                </li>
                <ChevronRight size={10} />
                {sitemap &&
                    sitemap.length > 0 &&
                    sitemap.map((item, k) => (
                        <span className="flex items-center gap-1" key={k}>
                            <li className={className}>
                                <a href={item.link}>{item.title}</a>
                            </li>
                            {sitemap.length != k + 1 && <ChevronRight size={10} />}
                        </span>
                    ))}
            </ul>
        </nav>
    );
};

export default SitemapPage;
