import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const API_BASE = "http://192.168.8.133"; 

export default function SmartDustbin() {
  const [level, setLevel] = useState(null);
  const [status, setStatus] = useState("Loading...");
  const [error, setError] = useState(false);

  const fetchBinStatus = async () => {
    try {
      const res = await fetch(`${API_BASE}/bin/status`);
      const data = await res.json();
      setLevel(data.level);
      setStatus(data.status);
      setError(false);
    } catch (err) {
      console.error("Error fetching bin status:", err);
      setError(true);
      setStatus("Error");
    }
  };

  useEffect(() => {
    fetchBinStatus();
    const interval = setInterval(fetchBinStatus, 5000); 
    return () => clearInterval(interval);
  }, []);

  // Dynamic color based on status
  let fillColor = "bg-green-500";
  if (status === "Half") fillColor = "bg-yellow-500";
  if (status === "Full") fillColor = "bg-red-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center w-full max-w-md p-6 bg-white shadow-lg rounded-xl"
    >
      <h2 className="mb-4 text-2xl font-bold text-gray-800">
        Smart Dustbin 
      </h2>

      {/* Status text */}
      <p
        className={`mb-4 text-lg font-semibold ${
          status === "Full"
            ? "text-red-600"
            : status === "Half"
            ? "text-yellow-600"
            : status === "Empty"
            ? "text-green-600"
            : "text-gray-600"
        }`}
      >
        {error ? "Connection Error" : `Status: ${status} (${level}%)`}
      </p>

      {/* Dustbin graphic */}
      <div className="relative w-32 h-48 mb-6 overflow-hidden bg-gray-100 border-4 border-gray-700 rounded-t-md">
        <motion.div
          className={`absolute bottom-0 left-0 w-full ${fillColor}`}
          initial={{ height: 0 }}
          animate={{ height: `${level || 0}%` }}
          transition={{ duration: 0.5 }}
        />
       <p className="absolute inset-0 flex items-center justify-center text-xl font-bold text-gray-800">
          {level !== null ? `${level}%` : "--"}
        </p>
      </div>

      {/* Refresh button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={fetchBinStatus}
        className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
      >
        Refresh
      </motion.button>
    </motion.div>
  );
}
