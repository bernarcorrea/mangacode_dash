import React from "react";

import IconInput from "./Icon";

const Input = ({ type, placeholder, icon, required, value, onChangeValue }) => {
    return (
        <div className="w-full flex gap-4 items-center">
            <IconInput icon={icon} />
            <input
                className="
                    flex-1 
                    pl-5 
                    pr-5 
                    rounded-full 
                    text-base 
                    h-14 
                    outline-none 
                    bg-opacity-10 
                    border 
                    border-opacity-0 
                    shadow-lg
                    text-white
                    border-white
                    bg-white 
                    focus:border-opacity-60
                    focus:bg-opacity-15
                "
                autoComplete="off"
                type={type}
                placeholder={placeholder}
                required={required}
                value={value}
                onChange={onChangeValue}
            />
        </div>
    );
};

export default Input;
