import React from "react";
import Icon from "./Icon";

const Loading = () => {
    return (
        <div
            className="
                fixed 
                top-0 
                left-0 
                w-full 
                h-full 
                z-30 
                flex 
                flex-col 
                justify-center 
                items-center
                bg-black 
                bg-opacity-40 
                backdrop-blur-sm
            "
        >
            <div className="text-white animate-spin">
                <Icon name="LoaderCircle" size={60} />
            </div>
        </div>
    );
};

export default Loading;
