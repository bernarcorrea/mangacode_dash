import React, { useEffect, useState } from "react";

import InputText from "../components/InputText";
import ButtonLink from "../components/ButtonLink";
import Error from "../components/Error";

import { useAppContext } from "@/contexts/admin/AppWrapper";

import Api from "@/services/api";
import { useRouter } from "next/navigation";
import { refreshRouter } from "@/services/helpers";
import Icon from "../components/Icon";
import InputCheckBox from "../components/InputCheckBox";

const Form = ({ data, items, setViewModal }) => {
    const { setLoading, setErrorModal, setMaskModal, loginToken, setLoginToken } = useAppContext();
    const [error, setError] = useState("");

    const [fieldId, setFieldId] = useState("");
    const [fieldTitle, setFieldTitle] = useState("");
    const [elementsCheckedItems, setElementsCheckedItems] = useState([]);
    const [showElements, setShowElements] = useState([]);

    const router = useRouter();

    useEffect(() => {
        setFieldId(data ? data.profile.id : "");
        setFieldTitle(data ? data.profile.title : "");
        setElementsCheckedItems(data ? data.elements : []);
    }, [data]);

    const handleSubmitForm = async () => {
        setError(false);
        setErrorModal(false);
        setLoading(true);

        if (!fieldTitle) {
            setLoading(false);
            setError({
                type: "error",
                description: "Você precisa preencher todos os campos obrigatórios.",
            });
            return;
        }

        try {
            const response = await Api.post("/admin/perfis/manager", {
                token: loginToken,
                id: fieldId,
                title: fieldTitle,
                elements: elementsCheckedItems,
            });

            if (response.data) {
                setLoading(false);
                setErrorModal({
                    type: !response.data.status ? "error" : "success",
                    description: response.data.error.message,
                });

                if (response.data.status) {
                    refreshRouter("/admin/perfis", 1500);
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

    const handleElementsCheckBoxClick = (item) => {
        const newElementsChecked = [...elementsCheckedItems];
        if (newElementsChecked.includes(item)) {
            newElementsChecked.splice(newElementsChecked.indexOf(item), 1);
        } else {
            newElementsChecked.push(item);
        }
        setElementsCheckedItems(newElementsChecked);
    };

    const handleShowElements = (item) => {
        const newElementsShow = [...showElements];
        if (newElementsShow.includes(item)) {
            newElementsShow.splice(newElementsShow.indexOf(item), 1);
        } else {
            newElementsShow.push(item);
        }
        setShowElements(newElementsShow);
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
                        placeholder="Título do perfil"
                        required={true}
                        value={fieldTitle}
                        onChangeValue={(t) => setFieldTitle(t.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">Permissões de Módulos/Elementos:</h3>
                    </div>

                    <div className="p-4 bg-zinc-100 border rounded-lg flex flex-col gap-3 max-h-[350px] overflow-auto">
                        {items.length > 0 ? (
                            items.map((mod, m) => (
                                <div key={m} className="p-3 bg-white rounded-lg border">
                                    <div
                                        className="flex justify-between items-center hover:text-rose-600 cursor-pointer"
                                        onClick={() => handleShowElements(mod.id)}
                                    >
                                        <p className="font-bold">{mod.title}</p>
                                        <Icon
                                            name={`${showElements.includes(mod.id) ? "ChevronDown" : "ChevronRight"}`}
                                            size={17}
                                        />
                                    </div>

                                    {showElements.includes(mod.id) && (
                                        <div className="flex flex-col gap-1 mt-2">
                                            {mod.elements.length > 0 ? (
                                                mod.elements.map((elem, e) => (
                                                    <div
                                                        key={e}
                                                        className="flex items-center gap-2 px-2 py-1 rounded border cursor-pointer bg-zinc-50 hover:border-rose-300"
                                                        onClick={() => handleElementsCheckBoxClick(elem.id)}
                                                    >
                                                        <InputCheckBox
                                                            checked={elementsCheckedItems.includes(elem.id)}
                                                            onClick={() => handleElementsCheckBoxClick(elem.id)}
                                                        />
                                                        <p className="text-xs">{elem.title}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="flex items-center gap-1">
                                                    <span className="text-rose-600">
                                                        <Icon name="X" size={15} />
                                                    </span>
                                                    <p className="text-sm uppercase">Não há elementos cadastrados.</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center gap-1">
                                <span className="text-rose-600">
                                    <Icon name="X" size={15} />
                                </span>
                                <p className="text-sm uppercase">Não há módulos cadastrados.</p>
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
