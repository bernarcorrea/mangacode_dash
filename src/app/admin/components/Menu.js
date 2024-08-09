"use client";

import React, { useEffect, useState } from "react";

import Image from "next/image";
import { Menu as MenuIcon, ChevronLeft } from "lucide-react";
import { logout } from "@/services/helpers";

import MenuLink from "./MenuLink";
import SubmenuLink from "./SubmenuLink";
import ButtonLink from "./ButtonLink";
import { useAppContext } from "@/contexts/admin/AppWrapper";

const Menu = ({ showMenuTitle, setShowMenuTitle }) => {
    const [submenuTitle, setSubmenuTitle] = useState("");
    const [submenuLinks, setSubmenuLinks] = useState([]);
    const { menuLinks } = useAppContext();

    const handleCloseSubmenu = () => {
        setSubmenuLinks([]);
        setSubmenuTitle("");
    };

    return (
        <aside
            className={`
            duration-300
            flex 
            flex-col 
            justify-center 
            items-center 
            ${!showMenuTitle ? "w-36" : "w-64"} 
            p-4 
            fixed
            h-full
            top-0
            left-0
            z-10
        `}
        >
            <span
                onClick={() => setShowMenuTitle(!showMenuTitle ? true : false)}
                className="
                    absolute 
                    z-20
                    shadow-md 
                    cursor-pointer 
                    top-12 
                    right-0 
                    w-7 
                    h-7 
                    flex 
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-zinc-200
                    bg-white 
                    hover:border-zinc-300
                "
            >
                {!showMenuTitle ? (
                    <MenuIcon className="text-black" size={15} />
                ) : (
                    <ChevronLeft className="text-black" size={15} />
                )}
            </span>

            <div className="flex-1 flex flex-col justify-between items-center rounded-3xl w-full py-6 bg-rose-600">
                <div className="flex justify-center">
                    <Image src="/assets/admin/logo.png" width={50} height={50} alt="Logo" />
                </div>
                <nav className={`flex flex-col gap-7`}>
                    <MenuLink
                        title="Dashboard"
                        icon="Home"
                        href="/admin"
                        showMenuTitle={showMenuTitle}
                        setShowMenuTitle={setShowMenuTitle}
                        setSubmenuLinks={setSubmenuLinks}
                        setSubmenuTitle={setSubmenuTitle}
                        submenuLinks={[]}
                    />

                    {menuLinks && menuLinks.length > 0
                        ? menuLinks.map((me, k) => (
                              <MenuLink
                                  key={k}
                                  title={me.title}
                                  icon={me.icon_menu}
                                  href={me.submenu && me.submenu.length > 0 ? "#" : me.uri}
                                  showMenuTitle={showMenuTitle}
                                  setShowMenuTitle={setShowMenuTitle}
                                  setSubmenuLinks={setSubmenuLinks}
                                  setSubmenuTitle={setSubmenuTitle}
                                  submenuLinks={me.submenu && me.submenu.length > 0 ? me.submenu : []}
                              />
                          ))
                        : ""}
                </nav>
                <div className={`flex flex-col gap-7`}>
                    <MenuLink
                        title="Sair"
                        icon="LogOut"
                        href="#"
                        showMenuTitle={showMenuTitle}
                        setShowMenuTitle={setShowMenuTitle}
                        setSubmenuLinks={setSubmenuLinks}
                        setSubmenuTitle={setSubmenuTitle}
                        submenuLinks={[]}
                        onClick={logout}
                    />
                </div>
            </div>

            {submenuLinks.length > 0 && (
                <div
                    style={{ left: "calc(100% - 20px)" }}
                    className="absolute flex flex-col min-h-full py-6 justify-center -z-10"
                >
                    <div className="relative min-w-52 flex flex-col flex-1 rounded-e-3xl shadow-lg bg-white">
                        <div className="absolute -top-2 -right-2">
                            <ButtonLink
                                onClick={handleCloseSubmenu}
                                size="small"
                                icon="X"
                                color="bg-rose-600 text-white"
                            />
                        </div>

                        <div className="ps-5 mb-3 mt-16">
                            <h2 className="text-md font-bold text-zinc-800">{submenuTitle}</h2>
                        </div>

                        {submenuLinks.map((link, k) => (
                            <SubmenuLink
                                key={k}
                                title={link.title}
                                href={link.uri}
                                setShowMenuTitle={setShowMenuTitle}
                                setSubmenuLinks={setSubmenuLinks}
                            />
                        ))}
                    </div>
                </div>
            )}

            <div
                className={`
                ${submenuLinks.length > 0 ? "opacity-100" : "opacity-0 pointer-events-none"}
                fixed 
                w-full 
                h-full 
                left-0 
                top-0 
                backdrop-blur-sm 
                -z-20 
                duration-300
                bg-black 
                bg-opacity-30
                `}
            ></div>
        </aside>
    );
};

export default Menu;
