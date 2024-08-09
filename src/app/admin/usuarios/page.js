"use client";

import React, { useEffect, useState } from "react";

import { useAppContext } from "@/contexts/admin/AppWrapper";

import HeaderPage from "../components/HeaderPage";
import ButtonLink from "../components/ButtonLink";
import Modal from "../components/Modal";
import DataTable from "../components/DataTable";

import Form from "./form";
import DeleteForm from "./delete";

import { useAuthorizationUser } from "@/services/helpers";
import Api from "@/services/api";

const Users = () => {
    const authorized = useAuthorizationUser("/admin/usuarios");

    const [viewModal, setViewModal] = useState(false);
    const [viewModalDelete, setViewModalDelete] = useState(false);
    const [dataModal, setDataModal] = useState(null);
    const [dataDeleteModal, setDataDeleteModal] = useState(null);
    const [listProfiles, setListProfiles] = useState([]);

    const [dataTable, setDataTable] = useState([]);
    const [rowsTable, setRowsTable] = useState([]);

    const { setMaskModal, maskModal, loginToken, setErrorModal, profileElements, setProfileElements } = useAppContext();

    const sitemap = [
        {
            title: "Usuários",
            link: "/admin/usuarios",
        },
    ];

    const handleModalManager = async (id) => {
        if (id) {
            try {
                const response = await Api.post("/admin/usuarios/visualizar", {
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

    const handleModalDelete = (user) => {
        setDataDeleteModal(user);
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
            title: "Nome de Usuário",
            field: "name",
            className: "",
        },
        {
            title: "E-mail",
            field: "email",
            className: "",
        },
        {
            title: "Perfil",
            field: "profile",
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
                    name: item.name,
                    email: item.email,
                    profile: item.profile.title,
                    actions: (
                        <div className="flex justify-end items-center gap-1">
                            {profileElements.includes("editar_usuarios") && (
                                <ButtonLink
                                    size="small"
                                    color="bg-blue-600 text-white"
                                    icon="SquarePen"
                                    onClick={() => handleModalManager(item.id)}
                                />
                            )}
                            {profileElements.includes("deletar_usuarios") && (
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
            setRowsTable(buildDataTable(data.users));
            setDataTable(data.users);

            if (data.profiles && data.profiles.length > 0) {
                const profiles = [];
                data.profiles.map((prof) => {
                    const p = {
                        value: prof.id,
                        label: prof.title,
                    };
                    profiles.push(p);
                });
                setListProfiles(profiles);
            }
        }
    }, [authorized, profileElements]);

    return (
        <>
            {authorized && (
                <div>
                    <div className="flex justify-between items-center">
                        <HeaderPage title="Usuários" icon="UsersRound" sitemap={sitemap} />
                        <nav className="flex items-center gap-2">
                            {profileElements.includes("criar_usuarios") && (
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
                        title={`${!dataModal ? "Criar" : "Editar"} Usuário`}
                        setViewModal={handleModalManager}
                        viewModal={viewModal}
                    >
                        <Form data={dataModal} profiles={listProfiles} setViewModal={setViewModal} />
                    </Modal>

                    <Modal
                        size="small"
                        title="Deletar Usuário"
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

export default Users;
