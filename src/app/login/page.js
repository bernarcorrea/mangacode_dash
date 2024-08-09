"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { faFaceFrownOpen } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Link from "next/link";

import Api from "@/services/api";

import Input from "./components/Input";
import Loading from "./components/Loading";
import Error from "./components/Error";

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [emailField, setEmailField] = useState("");
    const [passwordField, setPasswordField] = useState("");
    const [viewLogin, setViewLogin] = useState(false);

    const router = useRouter();

    const handleSubmitLogin = async (e) => {
        e.preventDefault();
        setError(false);
        setLoading(true);

        try {
            let response = await Api.post("/admin/login", {
                email: emailField,
                password: passwordField,
            });

            let data = response.data;
            setLoading(false);

            if (!data.status) {
                setError({
                    type: "error",
                    description: data.error.message,
                });
                return;
            }

            /** ARMAZENA TOKEN DE LOGIN NO LOCAL STORAGE */
            localStorage.setItem("token", data.data);

            setError({
                type: "success",
                description: data.error.message,
            });

            setTimeout(() => {
                /** DIRECIONA USUÁRIO PARA A HOME */
                router.push("/admin");
            }, 1500);
            
        } catch (error) {
            console.log("Ocorreu um erro: " + error);
        }
    };

    /**
     * PREVINE QUE O USUÁRIO ACESSE A VIEW DE LOGIN
     * JÁ ESTANDO COM O LOGIN EFETUADO
     */
    useEffect(() => {
        let tokenLogin = localStorage.getItem("token");
        if (tokenLogin) {
            router.push("/admin");
        } else {
            setViewLogin(true);
        }
    }, []);

    return (
        <>
            {loading && <Loading />}
            {error && <Error type={error.type} description={error.description} />}

            {viewLogin && (
                <div className="h-screen flex flex-col justify-center items-center p-5">
                    <div className="w-full max-w-[450px] flex flex-col justify-center items-center gap-7">
                        <Image src="/assets/admin/logo.png" width={70} height={70} alt="MangaCode" />
                        <h1 className="text-white text-base font-normal">Preencha os dados de acesso abaixo:</h1>
                        <form onSubmit={handleSubmitLogin} className="flex flex-col items-center gap-5 w-full">
                            <Input
                                type="email"
                                placeholder="E-mail"
                                icon={faUser}
                                required={true}
                                value={emailField}
                                onChangeValue={(t) => setEmailField(t.target.value)}
                            />

                            <Input
                                type="password"
                                placeholder="Senha"
                                icon={faLock}
                                required={true}
                                value={passwordField}
                                onChangeValue={(t) => setPasswordField(t.target.value)}
                            />

                            <Link
                                href="/password-request"
                                className="text-white text-opacity-50 hover:text-opacity-100 text-sm font-extralight uppercase"
                            >
                                <FontAwesomeIcon icon={faFaceFrownOpen} className="mr-1" />
                                Esqueci minha senha!
                            </Link>

                            <button
                                className="
                            w-full 
                            h-14 
                            p-3 
                            bg-opacity-90 
                            rounded-full 
                            uppercase 
                            text-base 
                            font-semibold
                            bg-white 
                            hover:bg-opacity-100 
                        "
                            >
                                Acessar agora
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default Login;
