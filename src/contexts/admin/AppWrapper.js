"use client";

import Api from "@/services/api";
import { useRouter } from "next/navigation";
import React, { createContext, useState, useContext, useEffect } from "react";

const AppContext = createContext();

export const AppWrapper = ({ children }) => {
    const [maskModal, setMaskModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorModal, setErrorModal] = useState(false);
    const [loginToken, setLoginToken] = useState("");
    const [profileElements, setProfileElements] = useState([]);
    const [user, setUser] = useState("");
    const [menuLinks, setMenuLinks] = useState([]);
    const router = useRouter();

    useEffect(() => {
        /** VERIFICA SE O TOKEN DE LOGIN EXISTE NO LOCALSTORAGE */
        const getToken = localStorage.getItem("token");
        if (!getToken) {
            return router.push("/login");
        } else {
            setLoginToken(getToken);

            /** BUSCA DADOS ATUALIZADOS DO USUÁRIO E ATUALIZA ESTADO 'USER' */
            const requestUser = async () => {
                try {
                    const response = await Api.post("/admin/usuarios/buscar-usuario-token", {
                        token: getToken,
                    });

                    if (!response.data.status) {
                        console.log(response.data.error);
                        return;
                    }

                    if (response.data) {
                        setUser(response.data.data);
                    }
                } catch (error) {
                    console.log(error);
                    return;
                }
            };

            const requestMenuByUser = async () => {
                try {
                    const response = await Api.post("/admin/menu/get", {
                        token: getToken,
                    });

                    if (!response.data.status) {
                        console.log(response.data.error);
                        return;
                    }

                    if (response.data) {
                        setMenuLinks(response.data.data);
                    }
                } catch (error) {
                    console.log(error);
                    return;
                }
            };

            requestUser();
            requestMenuByUser();
        }
    }, []);

    return (
        <AppContext.Provider
            value={{
                /** MASK MODAL */
                maskModal,
                setMaskModal,
                /** LOADING */
                loading,
                setLoading,
                /** ERROR MODAL */
                errorModal,
                setErrorModal,
                /** LOGIN TOKEN */
                loginToken,
                setLoginToken,
                /** USER */
                user,
                setUser,
                /** PROFILE ELEMENTS */
                profileElements,
                setProfileElements,
                /** PROFILE ELEMENTS */
                menuLinks,
                setMenuLinks,
            }}
        >
            <>{loginToken && children}</>
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    return useContext(AppContext);
};
