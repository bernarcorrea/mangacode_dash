import React from "react";
import LinkMenuDropdown from "./LinkMenuDropdown";
import { logout } from "@/services/helpers";

const MenuDropdown = () => {
    return (
        <div
            className={`
            absolute
            top-11
            right-0
            w-40
            rounded-xl
            bg-white
            shadow-lg
        `}
        >
            <nav>
                <ul className="flex flex-col">
                    <LinkMenuDropdown title="Editar perfil" href="/admin/usuarios/editar" icon="User" />
                    <LinkMenuDropdown title="Alterar Senha" href="/admin/usuarios/alterar-senha" icon="Lock" />
                    <LinkMenuDropdown onClick={() => logout()} title="Sair" href="#" icon="LogOut" />
                </ul>
            </nav>
        </div>
    );
};

export default MenuDropdown;
