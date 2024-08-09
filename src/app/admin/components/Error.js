import React from "react";

const Error = ({ type, description }) => {
    const errorTitle =
        type == "info" ? "Informativo!" : type == "alert" ? "Atenção!" : type == "error" ? "Oooops!" : "Tudo certo!";

    const errorColor =
        type == "info"
            ? "bg-blue-200 border-blue-500"
            : type == "alert"
            ? "bg-amber-100 border-amber-400"
            : type == "error"
            ? "bg-rose-200 border-rose-500"
            : "bg-emerald-200 border-emerald-500";

    return (
        <div className={`${errorColor} text-black text-opacity-70 rounded-lg flex items-center gap-4 border p-4`}>
            <div>
                <h3 className="font-bold text-xl">{errorTitle}</h3>
                <p className="font-normal text-base">{description}</p>
            </div>
        </div>
    );
};

export default Error;
