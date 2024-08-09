"use client";

import React, { useEffect, useState } from "react";

import { useAppContext } from "@/contexts/admin/AppWrapper";

import HeaderPage from "../components/HeaderPage";
import ButtonLink from "../components/ButtonLink";
import Modal from "../components/Modal";

import Form from "./form";
import DeleteForm from "./delete";

import { useAuthorizationUser } from "@/services/helpers";
import Api from "@/services/api";
import DataTable from "../components/DataTable";

const Profile = () => {
    const authorized = useAuthorizationUser("/admin/perfis");

    const [viewModal, setViewModal] = useState(false);
    const [viewModalDelete, setViewModalDelete] = useState(false);
    const [listItems, setListItems] = useState([]);
    const [dataModal, setDataModal] = useState(null);
    const [dataDeleteModal, setDataDeleteModal] = useState(null);

    const [dataTable, setDataTable] = useState([]);
    const [rowsTable, setRowsTable] = useState([]);

    const { setMaskModal, maskModal, loginToken, setErrorModal, profileElements, setProfileElements } = useAppContext();

    const sitemap = [
        {
            title: "Perfis de Usuário",
            link: "/admin/perfis",
        },
    ];

    const handleModalManager = async (id) => {
        if (id) {
            try {
                const response = await Api.post("/admin/perfis/visualizar", {
                    token: loginToken,
                    id: id,
                });

                if (!response.data.status) {
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
        setViewModal(!viewModal);
    };

    const handleModalDelete = (profile) => {
        setDataDeleteModal(profile);
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
            title: "Título do perfil",
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

                return {
                    id: <span className="font-bold">{i}</span>,
                    title: item.title,
                    actions: (
                        <div className="flex justify-end items-center gap-1">
                            {profileElements.includes("editar_perfis") && (
                                <ButtonLink
                                    size="small"
                                    color="bg-blue-600 text-white"
                                    icon="SquarePen"
                                    onClick={() => handleModalManager(item.id)}
                                />
                            )}
                            {profileElements.includes("deletar_perfis") && (
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

    useEffect(() => {
        if (authorized) {
            const data = authorized.data;

            /** SALVA ELEMENTOS DO MÓDULO NO CONTEXT API */
            setProfileElements(data.profile_elements);

            /** CONSTRÓI ESTRUTURA DA TABELA */
            setRowsTable(buildDataTable(data.profiles));
            setDataTable(data.profiles);

            setListItems(data.items);
        }
    }, [authorized, profileElements]);

    return (
        <>
            {authorized && (
                <div>
                    <div className="flex justify-between items-center">
                        <HeaderPage title="Perfis de Usuário" icon="UsersRound" sitemap={sitemap} />
                        <nav className="flex items-center gap-2">
                            {profileElements.includes("criar_perfis") && (
                                <ButtonLink
                                    color="text-white bg-rose-600"
                                    icon="SquarePen"
                                    onClick={() => handleModalManager()}
                                />
                            )}
                        </nav>
                    </div>

                    <div className="mt-6">
                        <DataTable
                            columns={columns}
                            rows={rowsTable}
                            data={dataTable}
                            setRowsTable={setRowsTable}
                            buildDataTable={buildDataTable}
                        />
                    </div>

                    <Modal
                        title={`${!dataModal ? "Criar" : "Editar"} Perfil`}
                        setViewModal={handleModalManager}
                        viewModal={viewModal}
                    >
                        <Form data={dataModal} items={listItems} setViewModal={setViewModal} />
                    </Modal>

                    <Modal
                        size="small"
                        title="Deletar Perfil"
                        setViewModal={handleModalDelete}
                        viewModal={viewModalDelete}
                    >
                        {/* <DeleteForm data={dataDeleteModal} setViewModalDelete={setViewModalDelete} /> */}
                    </Modal>
                </div>
            )}
        </>
    );
};

export default Profile;
