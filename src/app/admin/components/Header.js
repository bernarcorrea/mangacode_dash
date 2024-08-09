"use client";

import React, { useState } from "react";
import { useAppContext } from "@/contexts/admin/AppWrapper";
import Image from "next/image";

import ThemeSelect from "./ThemeSelect";
import MenuDropdown from "./MenuDropdown";
import Icon from "./Icon";

const Header = () => {
    const { user } = useAppContext();
    const [themeColor, setThemeColor] = useState("light");
    const [menuDropdown, setMenuDropdown] = useState(false);

    return (
        <header className="px-5 py-4 flex items-center justify-between border-b">
            <div>
                <h1 className="text-lg text-gray-900 font-bold">Bem-vindo(a) de volta, {user.name}.</h1>
                <div className="flex gap-1 items-center">
                    <p className="text-xs text-zinc-400 font-regular">Hoje, 26 de março de 2024.</p>
                    <p className="text-xs text-rose-400 font-regular uppercase">({user.profile_title})</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <ThemeSelect themeColor={themeColor} setThemeColor={setThemeColor} />
                <div
                    onClick={() => setMenuDropdown(!menuDropdown)}
                    className="
                        shadow-lg
                        relative
                        rounded-full 
                        w-9
                        h-9 
                        flex
                        justify-center
                        items-center
                        cursor-pointer
                        bg-rose-600
                        hover:bg-rose-500
                        duration-300
                    "
                >
                    <Image src="/assets/admin/user.png" width={20} height={20} alt="Usuário" />
                    {menuDropdown && <MenuDropdown />}
                </div>
            </div>
        </header>
    );
};

export default Header;
