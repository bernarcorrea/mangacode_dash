import React from "react";

const InputSelect = ({ title, size, options, required, value, onChangeValue }) => {
    const inputSize = size == "small" ? "text-sm h-10" : size == "large" ? "text-xl h-14" : "text-base h-12";

    return (
        <div className="w-full">
            <p className="text-sm font-normal uppercase mb-1">
                {title} {required && <span className="text-red-500">*</span>}
            </p>
            <select
                className={`${inputSize} w-full pl-4 pr-4 rounded-xl border border-b-2 outline-none focus:border-red-300`}
                required={required}
                value={value}
                onChange={onChangeValue}
            >
                <option value="">
                    Selecione um item
                </option>
                {options && options.length > 0
                    ? options.map((option, k) => (
                          <option key={k} value={option.value}>
                              {option.label}
                          </option>
                      ))
                    : null}
            </select>
        </div>
    );
};

export default InputSelect;
