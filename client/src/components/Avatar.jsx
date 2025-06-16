import React from "react";

function Avatar({
    name = "",
    src = "",
    className = "h-full w-full rounded-full object-cover object-center",
}) {
    return src !== "" ? (
        <img src={src} alt={name} className={className} />
    ) : (
        <div className="h-12 w-12 flex justify-center items-center rounded-full bg-gray-600 text-white">
            {name?.charAt(0)?.toUpperCase() || "?"}
        </div>
    );
}

export default Avatar;
