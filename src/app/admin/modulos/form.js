import React, { useEffect, useState } from "react";

import InputText from "../components/InputText";
import ButtonLink from "../components/ButtonLink";
import Error from "../components/Error";

import { useAppContext } from "@/contexts/admin/AppWrapper";

import Api from "@/services/api";
import { useRouter } from "next/navigation";
import { refreshRouter } from "@/services/helpers";
import Icon from "../components/Icon";

const Form = ({ data, setViewModal }) => {
    const { setLoading, setErrorModal, setMaskModal, loginToken, setLoginToken } = useAppContext();
    const [error, setError] = useState("");

    const [fieldId, setFieldId] = useState("");
    const [fieldTitle, setFieldTitle] = useState("");
    const [fieldElements, setFieldElements] = useState([]);

    const router = useRouter();

    useEffect(() => {
        setFieldId(data ? data.module.id : "");
        setFieldTitle(data ? data.module.title : "");
        
        if (data) {
            let arrElements = [];
            data.elements.map((elem, k) => {
                arrElements[k] = elem.title;
            });
            setFieldElements(arrElements);
        }
        
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
            const response = await Api.post("/admin/modulos/manager", {
                token: loginToken,
                id: fieldId,
                title: fieldTitle,
                elements: fieldElements,
            });

            if (response.data) {
                setLoading(false);
                setErrorModal({
                    type: !response.data.status ? "error" : "success",
                    description: response.data.error.message,
                });

                if (response.data.status) {
                    refreshRouter("/admin/modulos", 1500);
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

    const handleAddFieldElements = () => {
        setFieldElements([...fieldElements, ""]);
    };

    const handleChangeAdditionalField = (index, value) => {
        const updatedFieldsElements = [...fieldElements];
        updatedFieldsElements[index] = value;
        setFieldElements(updatedFieldsElements);
    };

    const handleRemoveFieldElement = (index) => {
        const updatedFieldsElements = [...fieldElements];
        updatedFieldsElements.splice(index, 1);
        setFieldElements(updatedFieldsElements);
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
                        placeholder="Título do módulo"
                        required={true}
                        value={fieldTitle}
                        onChangeValue={(t) => setFieldTitle(t.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">Elementos:</h3>
                        <ButtonLink
                            size="small"
                            title="Adicionar"
                            color="bg-zinc-700 text-white"
                            onClick={handleAddFieldElements}
                        />
                    </div>

                    <div className="p-4 bg-zinc-100 border rounded-lg flex flex-col gap-3">
                        {fieldElements.length > 0 ? (
                            fieldElements.map((elem, k) => (
                                <div key={k} className="flex items-center gap-3">
                                    <div className="flex-1">
                                        <InputText
                                            size="small"
                                            type="text"
                                            placeholder="Digite aqui..."
                                            required={false}
                                            value={elem}
                                            onChangeValue={(t) => handleChangeAdditionalField(k, t.target.value)}
                                        />
                                    </div>
                                    <ButtonLink
                                        size="small"
                                        icon="X"
                                        color="bg-rose-600 text-white"
                                        onClick={() => handleRemoveFieldElement(k)}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center gap-1">
                                <span className="text-rose-600">
                                    <Icon name="X" size={15} />
                                </span>
                                <p className="text-sm uppercase">Não há elementos cadastrados para este módulo.</p>
                            </div>
                        )}
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
