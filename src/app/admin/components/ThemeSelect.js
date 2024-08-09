"use client";

import { Moon, Sun } from "lucide-react";
import React from "react";

const ThemeSelect = ({ themeColor, setThemeColor }) => {
    return (
        <div
            onClick={() => setThemeColor(themeColor === "light" ? "dark" : "light")}
            className="flex min-w-16 items-center bg-white rounded-3xl shadow-xl p-1 cursor-pointer"
        >
            <span
                className={`
                    w-7 
                    h-7 
                    text-white 
                    flex 
                    items-center 
                    justify-center 
                    rounded-full 
                    bg-rose-600 
                    ${themeColor === "light" ? "opacity-100" : "opacity-0"}
                `}
            >
                <Sun size={15} />
            </span>
            <span
                className={`
                    w-7 
                    h-7 
                    text-white 
                    flex 
                    items-center 
                    justify-center 
                    rounded-full 
                    bg-rose-600 
                    ${themeColor === "dark" ? "opacity-100" : "opacity-0"}
                `}
            >
                <Moon size={15} />
            </span>
        </div>
    );
};

export default ThemeSelect;
