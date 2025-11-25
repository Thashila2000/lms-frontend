import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  PauseIcon,
} from "@heroicons/react/24/solid";

//ESP8266 IP
const API_BASE = "http://192.168.8.167";

export default function CurtainControl() {
  const [status, setStatus] = useState("loading");
  const [animating, setAnimating] = useState(false);

  const sendCommand = async (cmd) => {
    try {
      await fetch(`${API_BASE}/${cmd}`);

      if (cmd === "open" || cmd === "close") {
        setAnimating(true);
        setStatus(cmd === "open" ? "opening" : "closing");

        let tries = 0;
        const pollInterval = setInterval(async () => { 
          tries++;
          try {
            const res = await fetch(`${API_BASE}/status`);
            const data = await res.json();
            if (
              data.status === "open" ||
              data.status === "closed" ||
              tries > 10
            ) {
              clearInterval(pollInterval);
              setStatus(data.status);
              setAnimating(false);
            }
          } catch (err) {
            console.error("Polling error:", err);
            if (tries > 10) {
              clearInterval(pollInterval);
              setStatus("error");
              setAnimating(false);
            }
          }
        }, 1000);
      } else if (cmd === "stop") {
        setStatus("stopped");
        setAnimating(false);
      }
    } catch (err) {
      console.error("Command error:", err);
      setStatus("error");
      setAnimating(false);
    }
  };

  const statusColor =
    status === "open"
      ? "text-green-600"
      : status === "closed"
      ? "text-red-600"
      : status === "error"
      ? "text-gray-500"
      : "text-yellow-600";

  const curtainLeftX =
    status === "open"
      ? "-100%"
      : status === "closed"
      ? "0%"
      : animating && status === "opening"
      ? "-100%"
      : animating && status === "closing"
      ? "0%"
      : undefined;

  const curtainRightX =
    status === "open"
      ? "100%"
      : status === "closed"
      ? "0%"
      : animating && status === "opening"
      ? "100%"
      : animating && status === "closing"
      ? "0%"
      : undefined;

  const animationDuration = animating ? 4.5 : 0.5;

  const curtainLabel =
    status === "opening"
      ? "Opening..."
      : status === "closing"
      ? "Closing..."
      : status === "open"
      ? "Curtain Open"
      : status === "closed"
      ? "Curtain Closed"
      : status === "stopped"
      ? "Stopped"
      : "Status Unknown";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center w-full max-w-md p-6 bg-white shadow-md rounded-xl"
    >
      {/* Title */}
      <h2 className="mb-4 text-2xl font-bold text-center text-gray-800">
        Curtain Control
      </h2>

      {/* Status Display */}
      <p className={`mb-2 font-medium ${statusColor}`}>Status: {status}</p>

      {/* Curtain Animation */}
      <div className="relative w-full h-40 mb-6 overflow-hidden bg-gray-100 border border-gray-300 rounded-md">
        <motion.div
          className="absolute top-0 left-0 w-1/2 h-full bg-blue-500"   // 🔹 changed to blue
          animate={{ x: curtainLeftX }}
          transition={{ duration: animationDuration, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-0 right-0 w-1/2 h-full bg-blue-500"  // 🔹 changed to blue
          animate={{ x: curtainRightX }}
          transition={{ duration: animationDuration, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-yellow-400">
          {/* 🔹 changed status text color to gold */}
          {curtainLabel}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap justify-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => sendCommand("open")}
          className="flex items-center px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600"
        >
          <ArrowUpIcon className="w-5 h-5 mr-1" /> Open
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => sendCommand("close")}
          className="flex items-center px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
        >
          <ArrowDownIcon className="w-5 h-5 mr-1" /> Close
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => sendCommand("stop")}
          className="flex items-center px-4 py-2 text-white bg-yellow-500 rounded-lg hover:bg-yellow-600"
        >
          <PauseIcon className="w-5 h-5 mr-1" /> Stop
        </motion.button>
      </div>
    </motion.div>
  );
}
