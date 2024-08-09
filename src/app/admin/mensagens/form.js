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
import { requestCsrfToken } from "@/services/helpers";

export const FormPost = () => {
    const { setLoading, setErrorModal } = useAppContext();

    const [error, setError] = useState("");
    const [csrfToken, setCsrfToken] = useState("");
    const [fieldTitle, setFieldTitle] = useState("");
    const [fieldTypePost, setFieldTypePost] = useState("");
    const [fieldCategory, setFieldCategory] = useState("");
    const [fieldDescription, setFieldDescription] = useState("");
    const [fieldImageFile, setFieldImageFile] = useState("");
    const [fieldStatusPost, setFieldStatusPost] = useState(false);
    const [showImageDefault, setShowImageDefault] = useState(true);

    const handleSubmitForm = async () => {
        if (!fieldTitle || !fieldTypePost || !fieldCategory) {
            setError({
                type: "error",
                description: "Você precisa preencher todos os campos obrigatórios.",
            });
            return;
        }

        setError(false);
        setErrorModal(false);
        setLoading(true);

        if (csrfToken) {
           //
        }
    };

    /** REQUEST CSRF TOKEN */
    useEffect(() => {
        const fetchCsrfToken = async () => {
            const token = await requestCsrfToken();
            setCsrfToken(token);
        };
        fetchCsrfToken();
    }, []);

    useEffect(() => {
        setShowImageDefault(fieldImageFile.name ? false : true);
    }, [fieldImageFile]);

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
                        {showImageDefault ? (
                            <Image src={ImageDefault} alt="Selecione uma imagem" className="w-full rounded-xl" />
                        ) : (
                            !showImageDefault &&
                            fieldImageFile && (
                                <Image
                                    src={URL.createObjectURL(fieldImageFile)}
                                    className="w-full rounded-xl"
                                    width={1000}
                                    height={1000}
                                    alt={fieldImageFile.name}
                                />
                            )
                        )}

                        <div className="m-4"></div>

                        <InputFile title="Foto de capa" required={false} onChangeValue={setFieldImageFile} />

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
                            options={[
                                { value: 1, label: "Dicas" },
                                { value: 2, label: "Novidades" },
                            ]}
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

                            <ButtonLink color="text-white bg-rose-600" title="Salvar dados" onClick={handleSubmitForm} />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};
