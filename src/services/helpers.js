import React, { useEffect, useState } from "react";
import Api from "./api";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/contexts/admin/AppWrapper";

export const constants = {
    domain: 'http://localhost/mangacode/mangacode/backend/public/',
};

export const requestCsrfToken = async () => {
    try {
        const response = await Api.get("/csrf-token");
        return response.data.token;
    } catch (error) {
        throw error;
    }
};

export const useAuthorizationUser = (route) => {
    const { loginToken, setLoginToken } = useAppContext();
    const [authorized, setAuthorized] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const userRoutePermission = async () => {
            try {
                let response = await Api.post(route, {
                    token: loginToken,
                });
                setAuthorized(response.data);
            } catch (error) {
                let dataError = error.response.data.error;
                switch (dataError.message) {
                    case "login_expiry":
                        setLoginToken(""); // ZERA ESTADO DO TOKEN DE LOGIN
                        localStorage.removeItem("token"); // REMOVE TOKEN DE LOGIN DO LOCAL STORAGE
                        router.push("/login"); // REDIRECIONA PARA O LOGIN
                        break;

                    case "permission_denied":
                        router.push("/admin/permission-denied"); // REDIRECIONA PARA VIEW DE PERMISSÃO NEGADA
                        break;
                }
            }
        };
        userRoutePermission();
    }, []);

    return authorized;
};

export const refreshRouter = (route, timer) => {
    const setTimer = timer ? timer : 1000;

    const refresh = setTimeout(() => {
        window.location.reload(route);
    }, setTimer);

    return refresh;
};

export const logout = () => {
    const loginToken = localStorage.getItem("token");

    /** REMOVE TOKEN DO LOCAL STORAGE */
    if (loginToken) {
        localStorage.removeItem("token");
    }

    refreshRouter('/login', 1);
};
