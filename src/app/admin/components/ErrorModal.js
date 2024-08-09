import React from "react";
import Icon from "./Icon";
import ButtonLink from "./ButtonLink";

const ErrorModal = ({ type, description, setErrorModal }) => {
    const errorTitle =
        type == "info" ? "Informativo!" : type == "alert" ? "Atenção!" : type == "error" ? "Oooops!" : "Tudo certo!";

    const errorIcon = type == "info" ? "Smile" : type == "alert" ? "Meh" : type == "error" ? "Frown" : "Laugh";

    const errorColor =
        type == "info"
            ? "bg-blue-500"
            : type == "alert"
            ? "bg-amber-400"
            : type == "error"
            ? "bg-rose-500"
            : "bg-emerald-500";

    return (
        <div
            className={`
                ${errorColor}
                bg-opacity-95
                fixed
                top-5
                right-5
                z-30
                rounded-xl 
                flex 
                items-center 
                gap-4 
                p-4
                w-full
                max-w-[400px]
                text-white
            `}
        >
            <div className="absolute -top-2 -right-2">
                <ButtonLink size="small" color="bg-rose-600" icon="X" onClick={() => setErrorModal(false)} />
            </div>
            <div>
                <Icon name={errorIcon} size={50} />
            </div>
            <div>
                <h3 className="font-bold text-xl">{errorTitle}</h3>
                <p className="font-normal text-base">{description}</p>
            </div>
        </div>
    );
};

export default ErrorModal;
