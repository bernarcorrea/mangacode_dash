import React from "react";
import ButtonLink from "./ButtonLink";

const Modal = ({ title, size, setViewModal, viewModal, children }) => {
    const closeModal = () => {
        setViewModal(false);
    };

    const modalSize = size == "small" ? "max-w-[600px]" : size == "large" ? "max-w-[1200px]" : "max-w-[900px]";

    return (
        <div
            className={`
                fixed 
                z-20 
                w-full 
                h-full 
                p-7 
                top-0 
                left-0 
                flex 
                justify-center 
                items-start 
                overflow-auto
                ${viewModal ? "opacity-100" : "opacity-0 pointer-events-none"}
            `}
        >
            <div
                className={`
                    ${modalSize} 
                    w-full 
                    rounded-2xl 
                    shadow-lg 
                    bg-white 
                    relative 
                    transition-opacity 
                    duration-300 
                    ${viewModal ? "opacity-100" : "opacity-0 pointer-events-none"}
                `}
            >
                <span className="absolute -right-2 -top-2">
                    <ButtonLink href="#" color="bg-rose-600 text-white" size="small" icon="X" onClick={closeModal} />
                </span>
                <header className="p-6 border-b border-zinc-200">
                    <h2 className="text-2xl font-bold">{title}</h2>
                </header>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
};

export default Modal;
