"use client";

import React, { useEffect, useState } from "react";

import { useAppContext } from "@/contexts/admin/AppWrapper";

import HeaderPage from "../../components/HeaderPage";

import { refreshRouter, useAuthorizationUser } from "@/services/helpers";
import Api from "@/services/api";

import InputText from "../../components/InputText";
import InputSelect from "../../components/InputSelect";
import ButtonLink from "../../components/ButtonLink";
import { useRouter } from "next/navigation";

const UserUpdatePage = () => {
    const authorized = useAuthorizationUser("/admin/usuarios/editar");
    const { setLoading, setErrorModal, setMaskModal, loginToken, setLoginToken, profileElements, setProfileElements } =
        useAppContext();
    const [error, setError] = useState("");

    const [fieldId, setFieldId] = useState("");
    const [fieldName, setFieldName] = useState("");
    const [fieldEmail, setFieldEmail] = useState("");
    const [fieldProfile, setFieldProfile] = useState("");
    const [listProfiles, setListProfiles] = useState([]);

    const router = useRouter();

    const sitemap = [
        {
            title: "Editar Perfil",
            link: "/admin/usuarios/editar",
        },
    ];

    const handleSubmitForm = async () => {
        setError(false);
        setErrorModal(false);
        setLoading(true);

        if (!fieldName || !fieldEmail || !fieldProfile) {
            setLoading(false);
            setError({
                type: "error",
                description: "Você precisa preencher todos os campos obrigatórios.",
            });
            return;
        }

        try {
            const response = await Api.post("/admin/usuarios/manager", {
                token: loginToken,
                id: fieldId,
                name: fieldName,
                email: fieldEmail,
                profile: fieldProfile,
            });

            if (response.data) {
                setLoading(false);
                setErrorModal({
                    type: !response.data.status ? "error" : "success",
                    description: response.data.error.message,
                });

                if (response.data.status) {
                    refreshRouter("/admin/usuarios/editar", 1500);
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
            const data = authorized.data;

            /** SALVA ELEMENTOS DO MÓDULO NO CONTEXT API */
            setProfileElements(data.profile_elements);

            if (data && data.profiles.length > 0) {
                const profiles = [];
                data.profiles.map((prof) => {
                    const p = {
                        value: prof.id,
                        label: prof.title,
                    };
                    profiles.push(p);
                });
                setListProfiles(profiles);
            }

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
                    setFieldName(userData.name);
                    setFieldEmail(userData.email);
                    setFieldProfile(userData.profile_id);
                } catch (error) {
                    console.log(error);
                }
            };
            getUserByToken();
        }
    }, [authorized, profileElements]);

    return (
        <>
            {authorized && (
                <div>
                    <div className="flex justify-between items-center">
                        <HeaderPage title="Editar Perfil" icon="User" sitemap={sitemap} />
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
                                <div className="mb-4">
                                    <InputText
                                        title="Nome"
                                        type="text"
                                        placeholder="Nome do usuário"
                                        required={true}
                                        value={fieldName}
                                        onChangeValue={(t) => setFieldName(t.target.value)}
                                    />
                                </div>

                                <div className="mb-4">
                                    <InputText
                                        title="E-mail"
                                        type="email"
                                        placeholder="E-mail"
                                        required={true}
                                        value={fieldEmail}
                                        onChangeValue={(t) => setFieldEmail(t.target.value)}
                                    />
                                </div>

                                <div className="mb-5">
                                    {profileElements.includes("alterar_perfil") ? (
                                        <InputSelect
                                            title="Perfil de Acesso"
                                            options={listProfiles}
                                            required={true}
                                            value={fieldProfile}
                                            onChangeValue={(t) => setFieldProfile(t.target.value)}
                                        />
                                    ) : (
                                        <InputText
                                            type="hidden"
                                            value={fieldProfile}
                                            onChangeValue={(t) => setFieldProfile(t.target.value)}
                                        />
                                    )}
                                </div>

                                <div className="flex justify-end items-center gap-3">
                                    <p className="text-sm text-zinc-400 font-normal uppercase">
                                        <span className="text-red-600">*</span> Campos obrigatórios
                                    </p>
                                    <ButtonLink
                                        color="text-white bg-rose-600"
                                        title="Salvar dados"
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

export default UserUpdatePage;
