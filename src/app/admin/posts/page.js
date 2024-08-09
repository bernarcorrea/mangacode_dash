"use client";

import React, { useEffect, useState } from "react";

import { useAppContext } from "@/contexts/admin/AppWrapper";
import { constants, useAuthorizationUser } from "@/services/helpers";
import Api from "@/services/api";

import DataTableServer from "../components/DataTableServer";
import HeaderPage from "../components/HeaderPage";
import ButtonLink from "../components/ButtonLink";
import Modal from "../components/Modal";

import Form from "./form";
import DeleteForm from "./delete";
import Image from "next/image";

import ImageDefault from "/public/assets/admin/cover.jpg";
import Icon from "../components/Icon";

const Posts = () => {
    const authorized = useAuthorizationUser("/admin/posts");

    const [dataModal, setDataModal] = useState(null);
    const [dataDeleteModal, setDataDeleteModal] = useState(null);
    const [viewModalPost, setViewModalPost] = useState(false);
    const [viewModalDelete, setViewModalDelete] = useState(false);

    const [rowsTable, setRowsTable] = useState([]);
    const [listCategories, setListCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const recordsPerPage = 50;

    const { setMaskModal, maskModal, loginToken, setErrorModal, profileElements, setProfileElements } = useAppContext();

    const sitemap = [
        {
            title: "Posts",
            link: "/admin/posts",
        },
    ];

    const getPostsOnDemand = async (offset = 0, limit = recordsPerPage, search = null) => {
        try {
            const response = await Api.post("/admin/posts/get", {
                token: loginToken,
                limit: limit,
                offset: offset,
                search: search,
            });

            if (response.data) {
                const data = response.data.data;

                /** CONSTRÓI ESTRUTURA DA TABELA */
                setRowsTable(buildDataTable(data.posts));
                setTotalRecords(data.total_posts);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (authorized) {
            const data = authorized.data;

            /** SALVA ELEMENTOS DO MÓDULO NO CONTEXT API */
            setProfileElements(data.profile_elements);

            if (data.categories && data.categories.length > 0) {
                const categories = [];
                data.categories.map((cat) => {
                    const c = {
                        value: cat.id,
                        label: cat.title,
                    };
                    categories.push(c);
                });
                setListCategories(categories);
            }
        }
        getPostsOnDemand((currentPage - 1) * recordsPerPage, recordsPerPage);
    }, [authorized, currentPage, profileElements]);

    const handleModalManagerPost = async (id) => {
        if (id) {
            try {
                const response = await Api.post("/admin/posts/visualizar", {
                    token: loginToken,
                    id: id,
                });

                if (!response.status) {
                    setErrorModal({
                        type: "error",
                        description: response.data.error.message,
                    });
                    return;
                }

                setDataModal(response.data.data);
            } catch (error) {
                setErrorModal({
                    type: "error",
                    description: error,
                });
            }
        } else {
            setDataModal(null);
        }

        setMaskModal(!maskModal);
        setViewModalPost(!viewModalPost);
    };

    const handleModalDelete = (post) => {
        setDataDeleteModal(post);
        setMaskModal(!maskModal);
        setViewModalDelete(!viewModalDelete);
    };

    const columns = [
        {
            title: "#",
            field: "id",
            className: "w-10",
        },
        {
            title: "Título",
            field: "title",
            className: "",
        },
        {
            title: "",
            field: "actions",
            className: "",
        },
    ];

    const buildDataTable = (data) => {
        if (data) {
            return data.map((item, k) => {
                let i = k + 1;
                let imagePost = item.cover ? constants.domain + item.cover : ImageDefault;

                return {
                    id: <span className="font-bold">{i}</span>,
                    title: (
                        <div className="flex items-center gap-4">
                            <div className="w-full md:w-[200px]">
                                <Image
                                    src={imagePost}
                                    alt={item.title}
                                    width={1000}
                                    height={1000}
                                    className="w-full rounded-xl"
                                />
                            </div>
                            <div>
                                <h3 className="text-lg text-dark font-bold mb-1">{item.title}</h3>
                                <div className="flex items-center gap-1 mb-1">
                                    <span className="text-zinc-400">
                                        <Icon size={10} name="ChevronRight" />
                                    </span>
                                    <p className="text-xs text-zinc-400 uppercase">
                                        Tipo:{" "}
                                        {item.type == 1 ? "Notícia" : item.type == 2 ? "Galeria de Imagens" : "Vídeo"}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1 mb-1">
                                    <span className="text-zinc-400">
                                        <Icon size={10} name="ChevronRight" />
                                    </span>
                                    <p className="text-xs text-zinc-400 uppercase">Categoria: {item.category.title}</p>
                                </div>
                            </div>
                        </div>
                    ),
                    actions: (
                        <div className="flex justify-end items-center gap-1">
                            {profileElements.includes("editar_posts") && (
                                <ButtonLink
                                    size="small"
                                    color="bg-blue-600 text-white"
                                    icon="SquarePen"
                                    onClick={() => handleModalManagerPost(item.id)}
                                />
                            )}
                            {profileElements.includes("deletar_posts") && (
                                <ButtonLink
                                    size="small"
                                    color="bg-rose-600 text-white"
                                    icon="Trash"
                                    onClick={() => handleModalDelete(item)}
                                />
                            )}
                        </div>
                    ),
                };
            });
        }
    };

    return (
        <>
            {authorized && (
                <div>
                    <div className="flex justify-between items-center">
                        <HeaderPage title="Posts" icon="MessageCircle" sitemap={sitemap} />
                        <nav className="flex items-center gap-2">
                            {profileElements.includes("criar_posts") && (
                                <ButtonLink
                                    color="text-white bg-rose-600"
                                    icon="SquarePen"
                                    onClick={() => handleModalManagerPost()}
                                />
                            )}
                        </nav>
                    </div>

                    <div className="mt-6">
                        <DataTableServer
                            columns={columns}
                            rows={rowsTable}
                            totalRecords={totalRecords}
                            recordsPerPage={recordsPerPage}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            fetchData={getPostsOnDemand}
                        />
                    </div>

                    <Modal
                        title={`${!dataModal ? "Criar" : "Editar"} postagem`}
                        setViewModal={handleModalManagerPost}
                        viewModal={viewModalPost}
                        size="large"
                    >
                        <Form data={dataModal} categories={listCategories} setViewModal={setViewModalPost} />
                    </Modal>

                    <Modal
                        size="small"
                        title="Deletar postagem"
                        setViewModal={handleModalDelete}
                        viewModal={viewModalDelete}
                    >
                        <DeleteForm data={dataDeleteModal} setViewModalDelete={setViewModalDelete} />
                    </Modal>
                </div>
            )}
        </>
    );
};

export default Posts;
