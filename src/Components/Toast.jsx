import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaTimesCircle, FaInfoCircle, FaExclamationTriangle } from "react-icons/fa";

export default function Toast({
  message,
  type = "info",
  onClose,
  duration = 3000,
}) {
  const [visible, setVisible] = useState(false);

  const typeStyles = {
    success: {
      icon: <FaCheckCircle className="text-green-500" />,
      bg: "bg-white text-gray-900 border-l-4 border-green-500",
      shadow: "shadow-green-200/50",
    },
    error: {
      icon: <FaTimesCircle className="text-red-500" />,
      bg: "bg-white text-gray-900 border-l-4 border-red-500",
      shadow: "shadow-red-200/50",
    },
    info: {
      icon: <FaInfoCircle className="text-blue-500" />,
      bg: "bg-white text-gray-900 border-l-4 border-blue-500",
      shadow: "shadow-blue-200/50",
    },
    warning: {
      icon: <FaExclamationTriangle className="text-yellow-500" />,
      bg: "bg-white text-gray-900 border-l-4 border-yellow-500",
      shadow: "shadow-yellow-200/50",
    },
  };

  const { icon, bg, shadow } = typeStyles[type] || typeStyles.info;

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 400);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, onClose, duration]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="toast"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={`fixed bottom-6 right-6 z-50 flex items-center w-80 gap-3 px-4 py-3 rounded-lg shadow-lg ${bg} ${shadow}`}
          style={{
            boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
          }}
        >
          <div className="text-2xl">{icon}</div>
          <div className="flex-1 text-sm font-medium leading-snug">
            {message}
          </div>
          <button
            onClick={() => {
              setVisible(false);
              setTimeout(onClose, 400);
            }}
            className="text-lg font-bold text-gray-500 transition-colors hover:text-gray-800"
          >
            ✖
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
