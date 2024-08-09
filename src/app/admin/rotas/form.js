import React, { useEffect, useState } from "react";

import InputText from "../components/InputText";
import InputSelect from "../components/InputSelect";
import ButtonLink from "../components/ButtonLink";
import InputCheckBox from "../components/InputCheckBox";
import Error from "../components/Error";
import Icon from "../components/Icon";

import { useAppContext } from "@/contexts/admin/AppWrapper";

import Api from "@/services/api";
import { useRouter } from "next/navigation";
import { refreshRouter } from "@/services/helpers";

const Form = ({ data, controllers, modules, profiles, routes_group, setViewModalRoutes }) => {
    const { setLoading, setErrorModal, setMaskModal, loginToken, setLoginToken } = useAppContext();
    const [error, setError] = useState("");

    const [fieldId, setFieldId] = useState("");
    const [fieldTitle, setFieldTitle] = useState("");
    const [fieldType, setFieldType] = useState("");
    const [fieldMethod, setFieldMethod] = useState("");
    const [fieldController, setFieldController] = useState("");
    const [fieldModule, setFieldModule] = useState("");
    const [fieldUri, setFieldUri] = useState("");
    const [fieldGroup, setFieldGroup] = useState("");
    const [fieldRoute, setFieldRoute] = useState("");
    const [fieldShowMenu, setFieldShowMenu] = useState("");
    const [fieldOrder, setFieldOrder] = useState(0);

    const [profilesCheckedItems, setProfilesCheckedItems] = useState([]);

    const router = useRouter();

    useEffect(() => {
        setFieldId(data ? data.route.id : "");
        setFieldTitle(data ? data.route.title : "");
        setFieldType(data ? data.route.type : "");
        setFieldMethod(data ? data.route.method : "");
        setFieldController(data ? data.route.controller_id : "");
        setFieldModule(data ? data.route.module_id : "");
        setFieldUri(data ? data.route.uri : "");
        setFieldGroup(data ? data.route.group : "");
        setFieldRoute(data ? data.route.route_id : "");
        setFieldShowMenu(data ? data.route.view_menu : "");
        setFieldOrder(data ? data.route.order : "");
        setProfilesCheckedItems(data ? data.profiles : []);
    }, [data]);

    const handleSubmitForm = async () => {
        setError(false);
        setErrorModal(false);
        setLoading(true);

        if (
            !fieldTitle ||
            !fieldType ||
            !fieldMethod ||
            !fieldController ||
            !fieldModule ||
            !fieldUri ||
            fieldGroup === "" ||
            fieldShowMenu === ""
        ) {
            setLoading(false);
            setError({
                type: "error",
                description: "Você precisa preencher todos os campos obrigatórios.",
            });
            return;
        }

        try {
            const response = await Api.post("/admin/rotas/manager", {
                token: loginToken,
                id: fieldId,
                title: fieldTitle,
                type: fieldType,
                method: fieldMethod,
                controller: fieldController,
                module: fieldModule,
                uri: fieldUri,
                group: fieldGroup,
                route_id: fieldRoute,
                view_menu: fieldShowMenu,
                order: fieldOrder,
                profiles: profilesCheckedItems,
            });

            if (response.data) {
                setLoading(false);
                setErrorModal({
                    type: !response.data.status ? "error" : "success",
                    description: response.data.error.message,
                });

                if (response.data.status) {
                    refreshRouter("/admin/rotas", 1500);
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

    const handleProfilesCheckBoxClick = (item) => {
        const newProfilesChecked = [...profilesCheckedItems];
        if (newProfilesChecked.includes(item)) {
            newProfilesChecked.splice(newProfilesChecked.indexOf(item), 1);
        } else {
            newProfilesChecked.push(item);
        }
        setProfilesCheckedItems(newProfilesChecked);
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
                        placeholder="Título da rota"
                        required={true}
                        value={fieldTitle}
                        onChangeValue={(t) => setFieldTitle(t.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 gap-5 mb-4 md:grid-cols-[auto_270px]">
                    <div>
                        <InputText
                            title="Uri da rota"
                            type="text"
                            placeholder="Exemplo: /admin"
                            required={true}
                            value={fieldUri}
                            onChangeValue={(t) => setFieldUri(t.target.value)}
                        />
                    </div>

                    <div>
                        <InputSelect
                            title="Tipo de Requisição"
                            options={[
                                { value: "get", label: "GET" },
                                { value: "post", label: "POST" },
                            ]}
                            required={true}
                            value={fieldType}
                            onChangeValue={(t) => setFieldType(t.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-5 mb-5 md:grid-cols-3">
                    <div>
                        <InputSelect
                            title="Módulo"
                            options={modules}
                            required={true}
                            value={fieldModule}
                            onChangeValue={(t) => setFieldModule(t.target.value)}
                        />
                    </div>

                    <div>
                        <InputSelect
                            title="Controlador"
                            options={controllers}
                            required={true}
                            value={fieldController}
                            onChangeValue={(t) => setFieldController(t.target.value)}
                        />
                    </div>

                    <div>
                        <InputText
                            title="Método (Função)"
                            type="text"
                            placeholder="Ex: updatePost"
                            required={true}
                            value={fieldMethod}
                            onChangeValue={(t) => setFieldMethod(t.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-5 mb-5 md:grid-cols-3">
                    <div>
                        <InputSelect
                            title="Visualizar no menu"
                            options={[
                                { value: 0, label: "Não" },
                                { value: 1, label: "Sim" },
                            ]}
                            required={true}
                            value={fieldShowMenu}
                            onChangeValue={(t) => setFieldShowMenu(t.target.value)}
                        />
                    </div>

                    <div>
                        <InputSelect
                            title="Grupo de rotas"
                            options={[
                                { value: 0, label: "Não" },
                                { value: 1, label: "Sim" },
                            ]}
                            required={true}
                            value={fieldGroup}
                            onChangeValue={(t) => setFieldGroup(t.target.value)}
                        />
                    </div>

                    <div>
                        <InputSelect
                            title="Rota Vinculada"
                            options={routes_group}
                            value={fieldRoute}
                            onChangeValue={(t) => setFieldRoute(t.target.value)}
                        />
                    </div>
                </div>

                <div className="mb-5">
                    <h3 className="text-lg font-semibold mb-2">Perfis permitidos:</h3>
                    <div
                        className="
                            bg-zinc-100 
                            max-h-[400px] 
                            p-3 
                            rounded 
                            border 
                            grid 
                            grid-cols-1 
                            md:grid-cols-2 
                            gap-4
                        "
                    >
                        {profiles.length > 0 ? (
                            profiles.map((prof, k) => (
                                <div
                                    key={k}
                                    className="
                                        bg-white 
                                        rounded-lg 
                                        border 
                                        p-2 
                                        flex 
                                        items-center 
                                        gap-2 
                                        cursor-pointer 
                                        hover:border-zinc-300
                                    "
                                    onClick={() => handleProfilesCheckBoxClick(prof.id)}
                                >
                                    <InputCheckBox
                                        checked={profilesCheckedItems.includes(prof.id)}
                                        onClick={() => handleProfilesCheckBoxClick(prof.id)}
                                    />
                                    <p className="text-sm uppercase">{prof.title}</p>
                                </div>
                            ))
                        ) : (
                            <article className="flex items-center gap-1">
                                <span className="text-rose-600">
                                    <Icon size={14} name="X" />
                                </span>
                                <p className="uppercase text-sm">Nenhum perfil encontrado</p>
                            </article>
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
