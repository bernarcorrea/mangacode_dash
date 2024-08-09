"use client";

import React, { useState } from "react";
import Menu from "./Menu";
import Header from "./Header";
import MaskModal from "./MaskModal";

import { useAppContext } from "@/contexts/admin/AppWrapper";
import Loading from "./Loading";
import ErrorModal from "./ErrorModal";

const LayoutDashboard = ({ children }) => {
    const { maskModal, loading, errorModal, setErrorModal } = useAppContext();
    const [showMenuTitle, setShowMenuTitle] = useState(false);

    return (
        <>
            {maskModal && <MaskModal />}
            {loading && <Loading />}
            {errorModal && (
                <ErrorModal type={errorModal.type} description={errorModal.description} setErrorModal={setErrorModal} />
            )}

            <div className="h-screen">
                <Menu showMenuTitle={showMenuTitle} setShowMenuTitle={setShowMenuTitle} />
                <main className={`${!showMenuTitle ? "ml-36" : "ml-64"} flex flex-col duration-300`}>
                    <Header />
                    <div className="flex-1 px-5 py-7">{children}</div>
                </main>
            </div>
        </>
    );
};

export default LayoutDashboard;
