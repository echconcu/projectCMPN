import React, { useEffect } from "react";

const Dialog = ({ isOpen, onClose, children }) => {
    useEffect(() => {
        // Close the dialog when the Escape key is pressed
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10" aria-hidden={!isOpen}>
            <div className="bg-white p-4 rounded-md shadow-md max-w-md w-full relative">
                <button className="bg-transparent border-0 text-xl font-bold cursor-pointer absolute top-2 right-2" onClick={onClose} aria-label="Close">
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
};

export default Dialog;