import React, { useEffect, useState } from "react";

import ButtonLink from "../components/ButtonLink";
import Error from "../components/Error";

import { useAppContext } from "@/contexts/admin/AppWrapper";

import Api from "@/services/api";
import { useRouter } from "next/navigation";
import { refreshRouter } from "@/services/helpers";

const DeleteForm = ({ data, setViewModalDelete }) => {
    const [routeData, setRouteData] = useState("");
    const [error, setError] = useState("");
    const { setLoading, setErrorModal, setMaskModal, loginToken, setLoginToken } = useAppContext();

    const router = useRouter();

    useEffect(() => {
        if (data) {
            setRouteData(data);
        }
    }, [data]);

    const handleDeleteForm = async () => {
        setError(false);
        setErrorModal(false);
        setLoading(true);

        try {
            const response = await Api.post("/admin/modulos/deletar", {
                token: loginToken,
                id: routeData.id,
            });

            if (response.data) {
                setLoading(false);
                setErrorModal({
                    type: !response.data.status ? "error" : "success",
                    description: response.data.error.message,
                });

                if (response.data.status) {
                    refreshRouter("/admin/modulos", 1500);
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

    return (
        <div>
            {error && <Error type={error.type} description={error.description} />}

            <p>Você confirma excluir este item?</p>

            {routeData && (
                <div className="mt-3 mb-5 p-3 border bg-zinc-100 rounded-lg">
                    <p className="text-sm mb-1 font-semibold">ID: {routeData.id}</p>
                    <p className="text-sm mb-1 font-semibold">Título: {routeData.title}</p>
                </div>
            )}

            <div className="flex justify-end items-center gap-3">
                <ButtonLink color="text-white bg-rose-600" title="Excluir" onClick={handleDeleteForm} />
            </div>
        </div>
    );
};

export default DeleteForm;
