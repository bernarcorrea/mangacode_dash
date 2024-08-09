"use client";

import React from "react";
import Icon from "../components/Icon";
import ButtonLink from "../components/ButtonLink";

const PermissionDenied = () => {
    return (
        <>
            <div className="w-full max-w-[550px]">
                <span className="opacity-20">
                    <Icon name="Lock" size={100} />
                </span>
                <h1 className="text-3xl font-bold mt-3">
                    Ops! Permissão <span className="text-rose-600">negada</span>.
                </h1>
                <p className="text-lg mt-2">
                    Parece que você não tem permissão de acesso para este conteúdo. Clique no botão abaixo para voltar a
                    página inicial:
                </p>
                <div className="mt-3 flex">
                    <ButtonLink
                        href="/admin"
                        icon="Home"
                        size="large"
                        color="bg-rose-600 text-white"
                        title="Página inicial"
                    />
                </div>
            </div>
        </>
    );
};

export default PermissionDenied;
