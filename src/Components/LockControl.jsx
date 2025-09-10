import React, { useState, useEffect } from "react";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = "http://192.168.8.167";

export default function LockControl() {
  const [status, setStatus] = useState("loading");

  const fetchStatus = async () => {
    try {
      const res = await fetch(`${API_BASE}/lockstatus`);
      const data = await res.json();
      setStatus(data.status);
    } catch (err) {
      setStatus("error");
    }
  };

  const sendCommand = async (cmd) => {
    await fetch(`${API_BASE}/${cmd}`);
    fetchStatus();
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const isUnlocked = status === "UNLOCKED";
  const statusColor =
    status === "UNLOCKED"
      ? "text-green-600"
      : status === "LOCKED"
      ? "text-red-600"
      : "text-gray-500";

  const iconVariants = {
    initial: { opacity: 0, y: -20, scale: 0.8 },
    animate: { opacity: 1, y: 0, scale: 1.4 },
    exit: { opacity: 0, y: 20, scale: 0.8 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center w-full p-6 bg-white shadow-md rounded-xl"
    >
      {/* Title */}
     <h2 className="mb-4 text-2xl font-bold text-center text-gray-800">
        Door Lock Control
      </h2>

      {/* Status Text */}
       <p className={`mb-2 font-medium ${statusColor}`}>Status: {status}</p>

      {/* Animated Lock Icon */}
      {/* Animated Lock Icon */}
<div className="relative flex items-center justify-center w-full h-24 mt-6 mb-6">
  <AnimatePresence mode="wait">
    {isUnlocked ? (
      <motion.div
        key="unlock"
        variants={iconVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.4 }}
        className="absolute"
        style={{ y: 10 }} // Move icon 10px down
      >
        <LockOpenIcon className="w-20 h-20 text-green-500" />
      </motion.div>
    ) : (
      <motion.div
        key="lock"
        variants={iconVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.4 }}
        className="absolute"
        style={{ y: 10 }} // Move icon 10px down
      >
        <LockClosedIcon className="w-20 h-20 text-red-500" />
      </motion.div>
    )}
  </AnimatePresence>
</div>


      {/* Buttons */}
     <div className="flex flex-wrap justify-center gap-3 mt-10">
  <motion.button
    whileTap={{ scale: 0.95 }}
    onClick={() => sendCommand("unlock")}
    className="flex items-center px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600"
  >
    <LockOpenIcon className="w-5 h-5 mr-1" /> Unlock
  </motion.button>
  <motion.button
    whileTap={{ scale: 0.95 }}
    onClick={() => sendCommand("lock")}
    className="flex items-center px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
  >
    <LockClosedIcon className="w-5 h-5 mr-1" /> Lock
  </motion.button>
</div>

    </motion.div>
  );
}
