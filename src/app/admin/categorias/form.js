import React, { useEffect, useState } from "react";

import InputText from "../components/InputText";
import ButtonLink from "../components/ButtonLink";
import Error from "../components/Error";

import { useAppContext } from "@/contexts/admin/AppWrapper";

import Api from "@/services/api";
import { useRouter } from "next/navigation";
import { refreshRouter } from "@/services/helpers";

const Form = ({ data, updateDataTable }) => {
    const { setLoading, setErrorModal, setMaskModal, maskModal, loginToken, setLoginToken } = useAppContext();
    const [error, setError] = useState("");

    const [fieldId, setFieldId] = useState("");
    const [fieldTitle, setFieldTitle] = useState("");

    const router = useRouter();

    useEffect(() => {
        setFieldId(data ? data.category.id : "");
        setFieldTitle(data ? data.category.title : "");
    }, [data]);

    const handleSubmitForm = async () => {
        setError(false);
        setErrorModal(false);
        setLoading(true);

        if (!fieldTitle) {
            setError({
                type: "error",
                description: "Você precisa preencher todos os campos obrigatórios.",
            });
            return;
        }

        try {
            const response = await Api.post("/admin/categorias/manager", {
                token: loginToken,
                id: fieldId,
                title: fieldTitle,
            });

            if (response.data) {
                setLoading(false);
                setErrorModal({
                    type: !response.data.status ? "error" : "success",
                    description: response.data.error.message,
                });

                if (response.data.status) {
                    const data = response.data.data;
                    updateDataTable(data.new_data);
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
                        title="Título"
                        type="text"
                        placeholder="Título da Categoria"
                        required={true}
                        value={fieldTitle}
                        onChangeValue={(t) => setFieldTitle(t.target.value)}
                    />
                </div>

                <div className="flex justify-end items-center gap-3">
                    <ButtonLink color="text-white bg-rose-600" title="Salvar dados" onClick={handleSubmitForm} />
                </div>
            </form>
        </div>
    );
};

export default Form;
