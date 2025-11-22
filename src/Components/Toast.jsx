import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Toast = ({ message, type = "success", duration = 3000, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  // Toast color schemes
  const colors = {
    success: { bg: "bg-green-100", text: "text-green-800", border: "border-green-400" },
    error: { bg: "bg-red-100", text: "text-red-800", border: "border-red-400" },
    warning: { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-400" },
    info: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-400" },
  };

  const { bg, text, border } = colors[type] || colors.info;

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className={`fixed bottom-5 right-5 z-50 w-80 p-4 border-l-4 rounded shadow-lg ${bg} ${text} ${border}`}
        >
          <div className="flex items-center justify-between">
            <p className="font-medium">{message}</p>
            <button
              onClick={onClose}
              className={`ml-4 font-bold ${text} hover:opacity-70 transition-opacity`}
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
