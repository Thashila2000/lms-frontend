import React, { useEffect } from "react";

export default function Toast({ message, onClose, duration = 3000 }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, onClose, duration]);

  if (!message) return null;

  return (
    <div className="fixed z-50 flex items-center gap-2 px-4 py-2 text-white bg-gray-800 rounded shadow-lg bottom-4 right-4 animate-fade-in">
      <span>{message}</span>
      <button
        onClick={onClose}
        className="text-lg font-bold text-white hover:text-red-400"
      >
        ✖
      </button>
    </div>
  );
}