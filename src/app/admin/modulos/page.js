"use client";

import React, { useEffect, useState } from "react";

import { useAppContext } from "@/contexts/admin/AppWrapper";

import HeaderPage from "../components/HeaderPage";
import ButtonLink from "../components/ButtonLink";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";

import Form from "./form";
import DeleteForm from "./delete";

import { useAuthorizationUser } from "@/services/helpers";
import Api from "@/services/api";

const Module = () => {
    const authorized = useAuthorizationUser("/admin/modulos");
    const [viewModal, setViewModal] = useState(false);
    const [viewModalDelete, setViewModalDelete] = useState(false);
    const [dataModal, setDataModal] = useState(null);
    const [dataDeleteModal, setDataDeleteModal] = useState(null);
    const [dataTable, setDataTable] = useState([]);
    const [rowsTable, setRowsTable] = useState([]);

    const { setMaskModal, maskModal, loginToken, setErrorModal, profileElements, setProfileElements } = useAppContext();

    const sitemap = [
        {
            title: "Módulos",
            link: "/admin/modulos",
        },
    ];

    const handleModalManager = async (id) => {
        if (id) {
            try {
                const response = await Api.post("/admin/modulos/visualizar", {
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

    const handleModalDelete = (module) => {
        setDataDeleteModal(module);
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
            title: "Título do módulo",
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
                            {profileElements.includes("editar_modulos") && (
                                <ButtonLink
                                    size="small"
                                    color="bg-blue-600 text-white"
                                    icon="SquarePen"
                                    onClick={() => handleModalManager(item.id)}
                                />
                            )}
                            {profileElements.includes("deletar_modulos") && (
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
            setRowsTable(buildDataTable(data.modules));
            setDataTable(data.modules);
        }
    }, [authorized, profileElements]);

    return (
        <>
            {authorized && (
                <div>
                    <div className="flex justify-between items-center">
                        <HeaderPage title="Módulos" icon="Box" sitemap={sitemap} />
                        <nav className="flex items-center gap-2">
                            {profileElements.includes("criar_modulos") && (
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
                        size="small"
                        title={`${!dataModal ? "Criar" : "Editar"} Módulo`}
                        setViewModal={handleModalManager}
                        viewModal={viewModal}
                    >
                        <Form data={dataModal} setViewModal={setViewModal} />
                    </Modal>

                    <Modal
                        size="small"
                        title="Deletar Módulo"
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

export default Module;
