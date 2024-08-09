"use client";

import React, { useEffect, useState } from "react";

import { useAppContext } from "@/contexts/admin/AppWrapper";

import { refreshRouter, useAuthorizationUser } from "@/services/helpers";
import Api from "@/services/api";

import HeaderPage from "../../components/HeaderPage";
import InputText from "../../components/InputText";
import InputSelect from "../../components/InputSelect";
import ButtonLink from "../../components/ButtonLink";
import Error from "../../components/Error";

import { useRouter } from "next/navigation";

const PasswordUpdatePage = () => {
    const authorized = useAuthorizationUser("/admin/usuarios/alterar-senha");
    const { setLoading, setErrorModal, setMaskModal, loginToken, setLoginToken } = useAppContext();
    const [error, setError] = useState("");

    const [fieldId, setFieldId] = useState("");
    const [fieldPassword, setFieldPassword] = useState("");
    const [fieldPasswordConfirm, setFieldPasswordConfirm] = useState("");

    const router = useRouter();

    const sitemap = [
        {
            title: "Alterar senha",
            link: "/admin/usuarios/alterar-senha",
        },
    ];

    const handleSubmitForm = async () => {
        setError(false);
        setErrorModal(false);
        setLoading(true);

        if (!fieldPassword || !fieldPasswordConfirm) {
            setLoading(false);
            setError({
                type: "error",
                description: "Você precisa preencher todos os campos obrigatórios.",
            });
            return;
        }

        try {
            const response = await Api.post("/admin/usuarios/password-update", {
                token: loginToken,
                id: fieldId,
                password: fieldPassword,
                password_confirm: fieldPasswordConfirm,
            });

            if (response.data) {
                setLoading(false);
                setErrorModal({
                    type: !response.data.status ? "error" : "success",
                    description: response.data.error.message,
                });

                if (response.data.status) {
                    refreshRouter("/admin/usuarios/alterar-senha", 1500);
                }
            }
        } catch (error) {
            setLoading(false);
            if (error.response.data.error) {
                setMaskModal(false);
                let dataError = error.response.data.error;

                switch (dataError.message) {
                    case "login_expiry":
                        setLoginToken("");
                        localStorage.removeItem("token");
                        router.push("/login");
                        break;

                    case "permission_denied":
                        router.push("/admin/permission-denied");
                        break;
                }
            } else {
                setErrorModal({
                    type: "error",
                    description: error,
                });
                return;
            }
        }
    };

    useEffect(() => {
        setErrorModal(false);
        if (authorized) {
            /** BUSCA USUÁRIO POR TOKEN */
            const getUserByToken = async () => {
                try {
                    const response = await Api.post("/admin/usuarios/buscar-usuario-token", {
                        token: loginToken,
                    });

                    if (!response.data.status) {
                        setErrorModal({
                            type: "error",
                            description: response.data.error.message,
                        });
                        return;
                    }

                    const userData = response.data.data;
                    setFieldId(userData.id);
                } catch (error) {
                    console.log(error);
                }
            };
            getUserByToken();
        }
    }, [authorized]);

    return (
        <>
            {authorized && (
                <div>
                    <div className="flex justify-between items-center">
                        <HeaderPage title="Alterar Senha" icon="Lock" sitemap={sitemap} />
                        <nav className="flex items-center gap-2">
                            <ButtonLink
                                href="#"
                                color="text-white bg-blue-600"
                                icon="ChevronLeft"
                                onClick={() => router.back()}
                            />
                        </nav>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 mt-7">
                        <div>
                            {error && <Error type={error.type} description={error.description} />}

                            <form className="mt-5">
                                <div className="grid grid-cols-1 gap-4 mb-5 md:grid-cols-2">
                                    <div>
                                        <InputText
                                            title="Senha"
                                            type="password"
                                            placeholder="*****"
                                            required={true}
                                            value={fieldPassword}
                                            onChangeValue={(t) => setFieldPassword(t.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <InputText
                                            title="Confirmar Senha"
                                            type="password"
                                            placeholder="*****"
                                            required={true}
                                            value={fieldPasswordConfirm}
                                            onChangeValue={(t) => setFieldPasswordConfirm(t.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end items-center gap-3">
                                    <p className="text-sm text-zinc-400 font-normal uppercase">
                                        <span className="text-red-600">*</span> Campos obrigatórios
                                    </p>
                                    <ButtonLink
                                        color="text-white bg-rose-600"
                                        title="Atualizar senha"
                                        onClick={handleSubmitForm}
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PasswordUpdatePage;
