import React, { useState } from "react";
import Icon from "./Icon";

const InputFile = ({ title, size, required, onChangeValue }) => {
    const inputSize = size == "small" ? "h-10" : size == "large" ? "h-14" : "h-12";
    const [selectedFileName, setSelectedFileName] = useState("");

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            let fileName = file.name;
            if (fileName.length > 30) {
                fileName = file.name.substr(0, 30) + "...";
            }
            setSelectedFileName(fileName);
            onChangeValue(file);
        } else {
            setSelectedFileName("Nenhum arquivo selecionado");
            onChangeValue("");
        }
    };

    return (
        <div className="w-full">
            <p className="text-sm font-normal uppercase mb-1">
                {title} {required && <span className="text-red-500">*</span>}
            </p>
            <div className="relative w-full cursor-pointer">
                <input
                    type="file"
                    onChange={handleFileChange}
                    required={required}
                    className="w-full h-full absolute top-0 left-0 opacity-0"
                />
                <div
                    className={`${inputSize} text-sm w-full flex items-center justify-between rounded-xl border border-b-2 pl-4 pr-4`}
                >
                    <span>{selectedFileName || "Nenhum arquivo selecionado"}</span>
                    <div className="text-white bg-rose-600 px-3 py-1 rounded flex items-center gap-1">
                        <Icon name="Paperclip" size={13} />
                        <span>Selecionar</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InputFile;
