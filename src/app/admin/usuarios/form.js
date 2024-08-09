import React, { useEffect, useState } from "react";

import InputText from "../components/InputText";
import InputSelect from "../components/InputSelect";
import ButtonLink from "../components/ButtonLink";
import Error from "../components/Error";

import { useAppContext } from "@/contexts/admin/AppWrapper";

import Api from "@/services/api";
import { useRouter } from "next/navigation";
import { refreshRouter } from "@/services/helpers";

const Form = ({ data, profiles, setViewModal }) => {
    const { setLoading, setErrorModal, setMaskModal, loginToken, setLoginToken } = useAppContext();
    const [error, setError] = useState("");

    const [fieldId, setFieldId] = useState("");
    const [fieldName, setFieldName] = useState("");
    const [fieldEmail, setFieldEmail] = useState("");
    const [fieldPassword, setFieldPassword] = useState("");
    const [fieldConfirmPassword, setFieldConfirmPassword] = useState("");
    const [fieldProfile, setFieldProfile] = useState("");

    const router = useRouter();

    useEffect(() => {
        setFieldId(data ? data.id : "");
        setFieldName(data ? data.name : "");
        setFieldEmail(data ? data.email : "");
        setFieldProfile(data ? data.profile_id : "");
    }, [data]);

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
                password: fieldPassword,
                password_confirm: fieldConfirmPassword,
                profile: fieldProfile,
            });

            if (response.data) {
                setLoading(false);
                setErrorModal({
                    type: !response.data.status ? "error" : "success",
                    description: response.data.error.message,
                });

                if (response.data.status) {
                    refreshRouter("/admin/usuarios", 1500);
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

    return (
        <div>
            <p className="text-sm text-zinc-400 font-normal uppercase mb-3">
                <span className="text-red-600">*</span> Campos obrigatórios
            </p>

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

                <div className="grid grid-cols-1 gap-5 mb-4 md:grid-cols-[auto_270px]">
                    <div>
                        <InputText
                            title="E-mail"
                            type="email"
                            placeholder="E-mail"
                            required={true}
                            value={fieldEmail}
                            onChangeValue={(t) => setFieldEmail(t.target.value)}
                        />
                    </div>

                    <div>
                        <InputSelect
                            title="Perfil de Acesso"
                            options={profiles}
                            required={true}
                            value={fieldProfile}
                            onChangeValue={(t) => setFieldProfile(t.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-5 mb-4 md:grid-cols-2">
                    <div>
                        <InputText
                            title="Senha"
                            type="password"
                            placeholder="*********"
                            value={fieldPassword}
                            onChangeValue={(t) => setFieldPassword(t.target.value)}
                        />
                    </div>

                    <div>
                        <InputText
                            title="Confirmar senha"
                            type="password"
                            placeholder="*********"
                            value={fieldConfirmPassword}
                            onChangeValue={(t) => setFieldConfirmPassword(t.target.value)}
                        />
                    </div>
                </div>

                <div className="flex justify-end items-center gap-3">
                    <ButtonLink color="text-white bg-rose-600" title="Salvar dados" onClick={handleSubmitForm} />
                </div>
            </form>
        </div>
    );
};

export default Form;
