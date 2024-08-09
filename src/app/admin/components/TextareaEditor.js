import dynamic from "next/dynamic";
import React, { useRef } from "react";

const JoditEditor = dynamic(() => import("jodit-react"), {
    ssr: false,
});

const TextareaEditor = ({ title, placeholder, required, value, onChangeValue }) => {
    const editor = useRef(null);
    const config = {
        readonly: false,
        minHeight: 500,
        placeholder: placeholder,
        speechRecognize: false,
        language: 'pt_br'
    };

    return (
        <div className="w-full">
            <p className="text-sm font-normal uppercase mb-1">
                {title} {required && <span className="text-red-500">*</span>}
            </p>
            <JoditEditor
                ref={editor}
                config={config}
                value={value}
                onBlur={onChangeValue}
                onChange={(newContent) => {}}
                tabIndex={1}
            />
        </div>
    );
};

export default TextareaEditor;
