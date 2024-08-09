import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const IconInput = ({ icon }) => {
    return (
        <div
            className="
                flex 
                items-center 
                justify-center 
                rounded-full 
                shadow-lg
                bg-white 
                bg-opacity-15 
                w-14 
                h-14
            "
        >
            <FontAwesomeIcon icon={icon} className="text-white text-xl" />
        </div>
    );
};

export default IconInput;
