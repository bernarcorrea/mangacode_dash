"use client";

import React, { useEffect, useState } from "react";

import { useAppContext } from "@/contexts/admin/AppWrapper";

import HeaderPage from "../components/HeaderPage";
import ButtonLink from "../components/ButtonLink";
import Icon from "../components/Icon";
import Modal from "../components/Modal";
import DataTable from "../components/DataTable";

import Form from "./form";
import DeleteForm from "./delete";

import { useAuthorizationUser } from "@/services/helpers";
import Api from "@/services/api";

const Routes = () => {
    const authorized = useAuthorizationUser("/admin/rotas");

    const [viewModalRoutes, setViewModalRoutes] = useState(false);
    const [viewModalDeleteRoutes, setViewModalDeleteRoutes] = useState(false);
    const [dataModal, setDataModal] = useState(null);
    const [dataDeleteModal, setDataDeleteModal] = useState(null);
    const [listModules, setListModules] = useState([]);
    const [listControllers, setListControllers] = useState([]);
    const [listProfiles, setListProfiles] = useState([]);
    const [listRoutesGroup, setListRoutesGroup] = useState([]);

    const [dataTable, setDataTable] = useState([]);
    const [rowsTable, setRowsTable] = useState([]);

    const { setMaskModal, maskModal, loginToken, setErrorModal, profileElements, setProfileElements } = useAppContext();

    const sitemap = [
        {
            title: "Rotas",
            link: "/admin/rotas",
        },
    ];

    const handleModalManagerRoutes = async (id) => {
        if (id) {
            try {
                const response = await Api.post("/admin/rotas/visualizar", {
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
        setViewModalRoutes(!viewModalRoutes);
    };

    const handleModalDeleteRoutes = (route) => {
        setDataDeleteModal(route);
        setMaskModal(!maskModal);
        setViewModalDeleteRoutes(!viewModalDeleteRoutes);
    };

    const columns = [
        {
            title: "#",
            field: "id",
            className: "w-10",
        },
        {
            title: "Título da rota",
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
                    title: (
                        <div>
                            <p className="font-medium mb-1">{item.uri}</p>
                            <small className="text-xs text-zinc-400 flex items-center">
                                <Icon name="ChevronRight" size={10} />
                                <span>Módulo: {item.module.title}</span>
                            </small>
                            <small className="text-xs text-zinc-400 flex items-center">
                                <Icon name="ChevronRight" size={10} />
                                <span>Controlador: {item.controller.title}</span>
                            </small>
                            <small className="text-xs text-zinc-400 flex items-center">
                                <Icon name="ChevronRight" size={10} />
                                <span>Método: {item.method}</span>
                            </small>
                        </div>
                    ),
                    actions: (
                        <div className="flex justify-end items-center gap-1">
                            {profileElements.includes("editar_rotas") && (
                                <ButtonLink
                                    size="small"
                                    color="bg-blue-600 text-white"
                                    icon="SquarePen"
                                    onClick={() => handleModalManagerRoutes(item.id)}
                                />
                            )}
                            {profileElements.includes("deletar_rotas") && (
                                <ButtonLink
                                    size="small"
                                    color="bg-rose-600 text-white"
                                    icon="Trash"
                                    onClick={() => handleModalDeleteRoutes(item)}
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
            setRowsTable(buildDataTable(data.routes));
            setDataTable(data.routes);

            if (data.modules && data.modules.length > 0) {
                const modules = [];
                data.modules.map((mod) => {
                    const m = {
                        value: mod.id,
                        label: mod.title,
                    };
                    modules.push(m);
                });
                setListModules(modules);
            }

            if (data.controllers && data.controllers.length > 0) {
                const controllers = [];
                data.controllers.map((cont) => {
                    const c = {
                        value: cont.id,
                        label: cont.title,
                    };
                    controllers.push(c);
                });
                setListControllers(controllers);
            }

            if (data.routes_group && data.routes_group.length > 0) {
                const routesGroup = [];
                data.routes_group.map((rout) => {
                    const rg = {
                        value: rout.id,
                        label: rout.title,
                    };
                    routesGroup.push(rg);
                });
                setListRoutesGroup(routesGroup);
            }

            if (data.profiles && data.profiles.length > 0) {
                setListProfiles(data.profiles);
            }
        }
    }, [authorized, profileElements]);

    return (
        <>
            {authorized && (
                <div>
                    <div className="flex justify-between items-center">
                        <HeaderPage title="Rotas" icon="Route" sitemap={sitemap} />
                        <nav className="flex items-center gap-2">
                            {profileElements.includes("criar_rotas") && (
                                <ButtonLink
                                    color="text-white bg-rose-600"
                                    icon="SquarePen"
                                    onClick={() => handleModalManagerRoutes()}
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
                        title={`${!dataModal ? "Criar" : "Editar"} Rota`}
                        setViewModal={handleModalManagerRoutes}
                        viewModal={viewModalRoutes}
                    >
                        <Form
                            data={dataModal}
                            controllers={listControllers}
                            modules={listModules}
                            profiles={listProfiles}
                            routes_group={listRoutesGroup}
                            setViewModalRoutes={setViewModalRoutes}
                        />
                    </Modal>

                    <Modal
                        size="small"
                        title="Deletar Rota"
                        setViewModal={handleModalDeleteRoutes}
                        viewModal={viewModalDeleteRoutes}
                    >
                        <DeleteForm data={dataDeleteModal} setViewModalDeleteRoutes={setViewModalDeleteRoutes} />
                    </Modal>
                </div>
            )}
        </>
    );
};

export default Routes;
