import React from "react";

const InputText = ({ title, type, size, placeholder, required, value, onChangeValue }) => {
    const inputSize = size == "small" ? "text-sm h-10" : size == "large" ? "text-xl h-14" : "text-base h-12";

    return (
        <div className="w-full">
            {title && (
                <p className="text-sm font-normal uppercase mb-1">
                    {title} {required && <span className="text-red-500">*</span>}
                </p>
            )}
            <input
                className={`${inputSize} w-full pl-4 pr-4 rounded-xl border border-b-2 outline-none focus:border-red-300`}
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

export default InputText;
