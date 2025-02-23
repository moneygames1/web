import React, { useState, useEffect } from "react";

type SnackbarProps = {
  message: string;
  type: "success" | "error";
  isVisible: boolean;
  onClose: () => void;
};

const Snackbar: React.FC<SnackbarProps> = ({
  message,
  type,
  isVisible,
  onClose,
}) => {
  console.log("snackbar");

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto close after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <div
      id="snackbar"
      className={`z-50 fixed top-0 uppercase right-0 transform -translate-x-1/2 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 ease-in-out 
      ${
        isVisible
          ? "opacity-100 scale-100"
          : "opacity-0 scale-90 pointer-events-none"
      } 
      ${
        type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
      }`}
    >
      <div className="flex items-center gap-2 text-lg">
        <button onClick={onClose}>{type === "success" ? "✓" : "✕"}</button>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Snackbar;
