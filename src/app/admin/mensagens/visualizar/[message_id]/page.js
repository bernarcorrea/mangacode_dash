"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ButtonLink from "@/app/admin/components/ButtonLink";
import HeaderPage from "@/app/admin/components/HeaderPage";

import { useAppContext } from "@/contexts/admin/AppWrapper";
import Api from "@/services/api";
import Error from "@/app/admin/components/Error";

const Message = ({ params }) => {
    const [messageName, setMessageName] = useState("");
    const [messageEmail, setMessageEmail] = useState("");
    const [messagePhone, setMessagePhone] = useState("");
    const [messageSubject, setMessageSubject] = useState("");
    const [messageDescription, setMessageDescription] = useState("");

    const [error, setError] = useState("");
    const { setLoading, setErrorModal, setMaskModal, loginToken, setLoginToken } = useAppContext();

    const id = params.message_id;
    const router = useRouter();

    const sitemap = [
        {
            title: "Mensagens",
            link: "/admin/mensagens",
        },
        {
            title: "Visualizar Mensagem",
            link: "/admin/mensagens/visualizar/" + id,
        },
    ];

    const getMessage = async () => {
        try {
            const response = await Api.post("/admin/mensagens/visualizar", {
                token: loginToken,
                id: id,
            });

            if (response.data.status) {
                const message = response.data.data.message;
                const elements = response.data.data.profile_elements;
                setMessageName(message.name);
                setMessageEmail(message.email);
                setMessagePhone(message.phone);
                setMessageSubject(message.subject);
                setMessageDescription(message.description);
            }
        } catch (error) {
            if (error.response.data.error) {
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
        getMessage();
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center">
                <HeaderPage title="Visualizar Mensagem" icon="UsersRound" sitemap={sitemap} />
                <nav className="flex items-center gap-1">
                    <ButtonLink
                        href="#"
                        color="text-white bg-blue-600"
                        icon="ChevronLeft"
                        onClick={() => router.back()}
                    />
                </nav>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 mt-7">
                <div>
                    {error && <Error type={error.type} description={error.description} />}

                    <div className="mb-4">
                        <p className="text-xs font-light uppercase mb-1">Nome:</p>
                        <div className="px-3 py-2 bg-white rounded border">
                            <p className="text-sm text-dark font-bold uppercase">{messageName}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
                        <div>
                            <p className="text-xs font-light uppercase mb-1">E-mail:</p>
                            <div className="px-3 py-2 bg-white rounded border">
                                <p className="text-sm text-dark font-bold">{messageEmail}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-light uppercase mb-1">Telefone:</p>
                            <div className="px-3 py-2 bg-white rounded border">
                                <p className="text-sm text-dark font-bold uppercase">{messagePhone}</p>
                            </div>
                        </div>
                    </div>
                    <div className="mb-4">
                        <p className="text-xs font-light uppercase mb-1">Assunto:</p>
                        <div className="px-3 py-2 bg-white rounded border">
                            <p className="text-sm text-dark font-bold uppercase">{messageSubject}</p>
                        </div>
                    </div>
                    <div className="mb-4">
                        <p className="text-xs font-light uppercase mb-1">Mensagem:</p>
                        <div className="px-3 py-2 min-h-24 bg-white rounded border">
                            <p className="text-sm text-dark font-bold">{messageDescription}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Message;
