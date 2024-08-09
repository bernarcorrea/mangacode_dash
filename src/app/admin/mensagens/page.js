"use client";

import React, { useEffect, useState } from "react";
import HeaderPage from "../components/HeaderPage";
import { useAppContext } from "@/contexts/admin/AppWrapper";
import { useAuthorizationUser } from "@/services/helpers";
import DataTableServer from "../components/DataTableServer";
import Api from "@/services/api";
import ButtonLink from "../components/ButtonLink";
import Modal from "../components/Modal";
import DeleteForm from "./delete";

const Messages = () => {
    const authorized = useAuthorizationUser("/admin/mensagens");
    const [viewModalDelete, setViewModalDelete] = useState(false);
    const [dataDeleteModal, setDataDeleteModal] = useState(null);

    const [rowsTable, setRowsTable] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const recordsPerPage = 50;

    const { setMaskModal, maskModal, loginToken, setErrorModal, profileElements, setProfileElements } = useAppContext();

    const sitemap = [
        {
            title: "Mensagens",
            link: "/admin/mensagens",
        },
    ];

    const getMessagesOnDemand = async (offset = 0, limit = recordsPerPage, search = null) => {
        try {
            const response = await Api.post("/admin/mensagens/get", {
                token: loginToken,
                limit: limit,
                offset: offset,
                search: search,
            });

            if (response.data) {
                const data = response.data.data;

                /** CONSTRÓI ESTRUTURA DA TABELA */
                setRowsTable(buildDataTable(data.messages));
                setTotalRecords(data.total_messages);
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
        }
        getMessagesOnDemand((currentPage - 1) * recordsPerPage, recordsPerPage);
    }, [authorized, currentPage, profileElements]);

    const columns = [
        {
            title: "#",
            field: "id",
            className: "w-10",
        },
        {
            title: "Nome",
            field: "name",
            className: "",
        },
        {
            title: "Assunto",
            field: "subject",
            className: "",
        },
        {
            title: "E-mail",
            field: "email",
            className: "",
        },
        {
            title: "Telefone",
            field: "phone",
            className: "",
        },
        {
            title: "",
            field: "actions",
            className: "",
        },
    ];

    const handleModalDelete = (category) => {
        setDataDeleteModal(category);
        setMaskModal(!maskModal);
        setViewModalDelete(!viewModalDelete);
    };

    const buildDataTable = (data) => {
        if (data) {
            return data.map((item, k) => {
                let i = k + 1;

                return {
                    id: <span className="font-bold">{i}</span>,
                    name: item.name,
                    subject: item.subject,
                    email: item.email,
                    phone: item.phone,
                    actions: (
                        <div className="flex justify-end items-center gap-1">
                            <ButtonLink
                                size="small"
                                color="bg-blue-600 text-white"
                                icon="Eye"
                                href={`/admin/mensagens/visualizar/${item.id}`}
                            />
                            <ButtonLink
                                size="small"
                                color="bg-rose-600 text-white"
                                icon="Trash"
                                onClick={() => handleModalDelete(item)}
                            />
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
                    <div>
                        <div className="flex justify-between items-center">
                            <HeaderPage title="Mensagens" icon="Mail" sitemap={sitemap} />
                        </div>
                    </div>

                    <div className="mt-6">
                        <DataTableServer
                            columns={columns}
                            rows={rowsTable}
                            totalRecords={totalRecords}
                            recordsPerPage={recordsPerPage}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            fetchData={getMessagesOnDemand}
                        />
                    </div>

                    <Modal
                        size="small"
                        title="Deletar Mensagem"
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

export default Messages;
