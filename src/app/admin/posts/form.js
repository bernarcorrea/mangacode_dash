import React, { useEffect, useState } from "react";
import Image from "next/image";

import ImageDefault from "/public/assets/admin/cover.jpg";

import InputText from "../components/InputText";
import InputSelect from "../components/InputSelect";
import TextareaEditor from "../components/TextareaEditor";
import InputFile from "../components/InputFile";
import ButtonLink from "../components/ButtonLink";
import InputCheckBox from "../components/InputCheckBox";
import Error from "../components/Error";

import { useAppContext } from "@/contexts/admin/AppWrapper";

import Api from "@/services/api";
import { constants, refreshRouter } from "@/services/helpers";
import { useRouter } from "next/navigation";

const Form = ({ data, categories, setViewModal }) => {
    const { setLoading, setErrorModal, setMaskModal, loginToken, setLoginToken } = useAppContext();

    const [error, setError] = useState("");
    const [fieldId, setFieldId] = useState("");
    const [fieldTitle, setFieldTitle] = useState("");
    const [fieldTypePost, setFieldTypePost] = useState("");
    const [fieldCategory, setFieldCategory] = useState("");
    const [fieldDescription, setFieldDescription] = useState("");
    const [fieldImageFileChange, setFieldImageFileChange] = useState("");
    const [fieldStatusPost, setFieldStatusPost] = useState(false);
    const [imagePost, setImagePost] = useState(ImageDefault);

    const router = useRouter();

    useEffect(() => {
        setFieldId(data ? data.post.id : "");
        setFieldTitle(data ? data.post.title : "");
        setFieldDescription(data ? data.post.description : "");
        setFieldTypePost(data ? data.post.type : "");
        setFieldCategory(data ? data.post.categorie_id : "");
        setFieldStatusPost(data ? data.post.status : "");
        setImagePost(data && data.post.cover ? constants.domain + data.post.cover : ImageDefault);
    }, [data]);

    const handleSubmitForm = async () => {
        setError(false);
        setErrorModal(false);
        setLoading(true);

        if (!fieldTitle || !fieldTypePost || !fieldCategory) {
            setLoading(false);
            setError({
                type: "error",
                description: "Você precisa preencher todos os campos obrigatórios.",
            });
            return;
        }

        const formData = new FormData();
        formData.append("token", loginToken);
        formData.append("id", fieldId);
        formData.append("title", fieldTitle);
        formData.append("type", fieldTypePost);
        formData.append("category", fieldCategory);
        formData.append("description", fieldDescription);
        formData.append("status", fieldStatusPost);
        formData.append("photo", fieldImageFileChange);

        try {
            const response = await Api.post("/admin/posts/manager", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data) {
                setLoading(false);
                setErrorModal({
                    type: !response.data.status ? "error" : "success",
                    description: response.data.error.message,
                });

                if (response.data.status) {
                    refreshRouter("/admin/posts", 1500);
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
        if (fieldImageFileChange.name) {
            setImagePost(URL.createObjectURL(fieldImageFileChange));
        } else {
            setImagePost(ImageDefault);
        }
    }, [fieldImageFileChange]);

    return (
        <div>
            <p className="text-sm text-zinc-400 font-normal uppercase mb-3">
                <span className="text-red-600">*</span> Campos obrigatórios
            </p>

            {error && <Error type={error.type} description={error.description} />}

            <form className="mt-5">
                <div className="flex gap-8">
                    <div className="flex-1">
                        <InputText
                            title="Título"
                            type="text"
                            placeholder="Título da postagem"
                            required={true}
                            value={fieldTitle}
                            onChangeValue={(t) => setFieldTitle(t.target.value)}
                        />

                        <div className="m-4"></div>

                        <TextareaEditor
                            title="Descrição"
                            placeholder="Descreva aqui o conteúdo da postagem..."
                            required={false}
                            value={fieldDescription}
                            onChangeValue={(t) => setFieldDescription(t)}
                        />
                    </div>

                    <div className="w-[450px]">
                        <Image
                            src={imagePost}
                            alt="Selecione uma imagem"
                            width={1000}
                            height={1000}
                            className="w-full rounded-xl"
                        />

                        <div className="m-4"></div>

                        <InputFile title="Foto de capa" required={false} onChangeValue={setFieldImageFileChange} />

                        <div className="m-4"></div>

                        <InputSelect
                            title="Tipo de postagem"
                            options={[
                                { value: 1, label: "Notícia" },
                                { value: 2, label: "Galeria de Imagens" },
                                { value: 3, label: "Vídeo" },
                            ]}
                            required={true}
                            value={fieldTypePost}
                            onChangeValue={(t) => setFieldTypePost(t.target.value)}
                        />

                        <div className="m-4"></div>

                        <InputSelect
                            title="Categoria"
                            options={categories}
                            required={true}
                            value={fieldCategory}
                            onChangeValue={(t) => setFieldCategory(t.target.value)}
                        />

                        <div className="m-5"></div>

                        <div className="flex justify-end items-center gap-3">
                            <div
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={() => setFieldStatusPost(fieldStatusPost ? false : true)}
                            >
                                <InputCheckBox
                                    checked={fieldStatusPost}
                                    onClick={() => setFieldStatusPost(fieldStatusPost ? false : true)}
                                />
                                <span className="text-xs text-zinc-700 font-normal uppercase">Publicar!</span>
                            </div>

                            <ButtonLink
                                color="text-white bg-rose-600"
                                title="Salvar dados"
                                onClick={handleSubmitForm}
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Form;
