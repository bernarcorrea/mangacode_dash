import React from "react";
import Icon from "./Icon";

const InputCheckBox = ({ checked, onClick }) => {
    const color = !checked ? "border border-zinc-300 hover:border-rose-300 bg-zinc-100" : "bg-rose-600 text-white";

    return (
        <div
            onClick={onClick}
            className={`
                ${color}
                w-6 
                h-6 
                cursor-pointer 
                flex 
                justify-center 
                items-center 
                rounded-md 
            `}
        >
            {checked && <Icon name="Check" size={15} />}
        </div>
    );
};

export default InputCheckBox;
