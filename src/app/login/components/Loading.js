import React from "react";
import { LoaderCircle } from "lucide-react";

const Loading = () => {
    return (
        <div
            className="
                absolute 
                w-full 
                h-full 
                z-30 
                bg-opacity-40 
                flex 
                flex-col 
                justify-center 
                items-center
                bg-black 
            "
        >
            <div className="text-white animate-spin">
                <LoaderCircle size={60} />
            </div>
        </div>
    );
};

export default Loading;
