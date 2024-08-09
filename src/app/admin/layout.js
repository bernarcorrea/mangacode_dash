import React from "react";
import "../globals.css";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

import { AppWrapper } from "@/contexts/admin/AppWrapper";
import LayoutDashboard from "./components/LayoutDashboard";

export const metadata = {
    title: "Dashboard - MangaCode",
    description: "",
};

const DashboardLayout = ({ children }) => {
    return (
        <html lang="pt-br">
            <body className="bg-zinc-100">
                <AppWrapper>
                    <LayoutDashboard children={children} />
                </AppWrapper>
            </body>
        </html>
    );
};

export default DashboardLayout;
