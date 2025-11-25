import { useEffect, useState } from "react";
import { FaLightbulb, FaPowerOff, FaRobot } from "react-icons/fa";
import { BsWifi, BsWifiOff } from "react-icons/bs";
import { motion } from "framer-motion";

// ESP8266 IP
const API_BASE = "http://192.168.8.115"; 

export default function SmartLight() {
  const [status, setStatus] = useState("Loading...");
  const [simulate, setSimulate] = useState(false);
  const [activeCmd, setActiveCmd] = useState("");
  const [connected, setConnected] = useState(false);

  const sendCommand = async (cmd) => {
    setActiveCmd(cmd);
    if (simulate) {
      setStatus(`Simulated ${cmd.toUpperCase()}`);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/${cmd}`);
      const text = await res.text();
      setStatus(text);
      setConnected(true);
    } catch (err) {
      console.error("Failed to fetch:", err);
      setStatus("ESP8266 not reachable");
      setConnected(false);
    }
  };

  useEffect(() => {
    if (simulate) {
      setStatus("Simulated Auto");
      return;
    }

    const interval = setInterval(() => {
      fetch(`${API_BASE}/status`)
        .then((res) => res.text())
        .then((text) => {
          setStatus(text);
          setConnected(true);
        })
        .catch(() => {
          setStatus("ESP8266 not reachable");
          setConnected(false);
        });
    }, 2000);

    return () => clearInterval(interval);
  }, [simulate]);

  const statusColor =
    status.includes("ON")
      ? "bg-green-500"
      : status.includes("OFF")
      ? "bg-red-500"
      : "bg-blue-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center w-full max-w-md p-6 bg-white shadow-lg rounded-xl min-h-[420px]"
    >
      <h2 className="mb-4 text-2xl font-bold text-center text-gray-800">
        Smart Light Control
      </h2>

      {/* Placeholder graphic box to match Dustbin height */}
      <div className="relative flex items-center justify-center w-32 h-48 mb-6 bg-gray-100 rounded-md">
        <FaLightbulb className="w-16 h-16 text-yellow-400 opacity-50" />
      </div>

      {/* Control buttons */}
      <div className="flex flex-wrap justify-center w-full gap-3 mb-4">
        <button
          onClick={() => sendCommand("on")}
          className={`flex items-center gap-2 px-4 py-2 text-white font-medium rounded-lg ${
            activeCmd === "on"
              ? "bg-green-600"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          <FaLightbulb /> ON
        </button>
        <button
          onClick={() => sendCommand("off")}
          className={`flex items-center gap-2 px-4 py-2 text-white font-medium rounded-lg ${
            activeCmd === "off"
              ? "bg-red-600"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          <FaPowerOff /> OFF
        </button>
        <button
          onClick={() => sendCommand("auto")}
          className={`flex items-center gap-2 px-4 py-2 text-white font-medium rounded-lg ${
            activeCmd === "auto"
              ? "bg-blue-600"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          <FaRobot /> Auto
        </button>
      </div>

      {/* Status display */}
      <p className={`px-3 py-1 rounded-full text-white ${statusColor} mb-2`}>
        {status}
      </p>

      {/* Connection indicator */}
      <p className="flex items-center gap-2 mb-2 text-sm">
        {connected ? (
          <>
            <BsWifi className="text-green-600" /> Connected
          </>
        ) : (
          <>
            <BsWifiOff className="text-red-600" /> Disconnected
          </>
        )}
      </p>

      {/* Simulate toggle */}
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={simulate}
          onChange={() => setSimulate(!simulate)}
          className="w-4 h-4"
        />
        Simulated Mode
      </label>
    </motion.div>
  );
}
