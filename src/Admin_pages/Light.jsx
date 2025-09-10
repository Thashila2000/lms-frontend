import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { lightControlDB } from "../firebase";
import { motion } from "framer-motion";
import AdminNavbar from "../Components/Admin_navbar";

// Icons
import { FaLightbulb, FaPowerOff, FaBolt, FaSun, FaUserShield, FaRunning } from "react-icons/fa";
import { MdUpdate, MdOutlineMode } from "react-icons/md";

const brightnessLevels = [
  { label: "Off", value: 0, icon: <FaPowerOff /> },
  { label: "Low", value: 85, icon: <FaLightbulb /> },
  { label: "Medium", value: 170, icon: <FaLightbulb /> },
  { label: "High", value: 255, icon: <FaBolt /> },
];

export default function Light_Control() {
  const { slug } = useParams();
  const [mode, setMode] = useState("manual");
  const [manualLevel, setManualLevel] = useState("medium");
  const [brightness, setBrightness] = useState(0);
  const [relayState, setRelayState] = useState({ main: false });
  const [ambientBrightness, setAmbientBrightness] = useState(0);
  const [motionDetected, setMotionDetected] = useState(false);
  const [powerConsumption, setPowerConsumption] = useState(0);
  const [userOverride, setUserOverride] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bulbBrightness, setBulbBrightness] = useState(0);

  const formattedTimestamp = useMemo(() => {
    if (!lastUpdated) return "—";
    const date = new Date(lastUpdated);
    return date.toLocaleString();
  }, [lastUpdated]);

  // Update relayState whenever brightness changes
  useEffect(() => {
    setRelayState({ main: brightness > 0 });
  }, [brightness]);

  // Manual brightness update 
  const updateBrightness = async (value) => {
    if (!slug) return;

    setBrightness(value);
    setBulbBrightness(value);

    let newManualLevel = "off";
    if (value === 85) newManualLevel = "low";
    else if (value === 170) newManualLevel = "medium";
    else if (value === 255) newManualLevel = "high";
    setManualLevel(newManualLevel);

    setRelayState({ main: value > 0 });

    try {
      const docRef = doc(lightControlDB, "classrooms", slug);
      await updateDoc(docRef, {
        mode: "manual",
        manualLevel: newManualLevel,
        userOverride: true,
        "lightControl.mode": "manual",
        "lightControl.manualLevel": newManualLevel,
        "lightControl.bulbBrightness": value,
        "lightControl.userOverride": true,
        "lightControl.timeStamp": new Date().toISOString(),
      });
    } catch (error) {
      console.error("Failed to update brightness:", error);
    }
  };

  // Switch mode
  const toggleMode = async () => {
    if (!slug) return;
    const newMode = mode === "manual" ? "auto" : "manual";
    setMode(newMode);

    try {
      const docRef = doc(lightControlDB, "classrooms", slug);
      await updateDoc(docRef, {
        mode: newMode,
        "lightControl.mode": newMode,
      });
    } catch (error) {
      console.error("Failed to toggle mode:", error);
    }
  };

  // Firestore listener
  useEffect(() => {
    if (!slug) {
      console.warn("Missing slug from URL.");
      return;
    }

    const docRef = doc(lightControlDB, "classrooms", slug);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const control = data.lightControl || {};

        setMode(data.mode || control.mode || "manual");
        setManualLevel(data.manualLevel || control.manualLevel || "medium");
        setBrightness(control.bulbBrightness ?? 0);
        setBulbBrightness(control.bulbBrightness ?? 0);
        setRelayState({ main: (control.bulbBrightness ?? 0) > 0 });

        setAmbientBrightness(control.ambientBrightness ?? 0);
        setMotionDetected(control.motionDetected ?? false);

        // typo from Arduino
        setPowerConsumption(control.powerConsumpsion ?? 0);

        setUserOverride(data.userOverride ?? control.userOverride ?? false);
        setLastUpdated(control.timeStamp || null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [slug]);

  const isRelayOn = brightness > 0;

  return (
    <>
      <AdminNavbar />
      <div className="p-4 mt-16 ml-0 md:ml-64 md:p-8">
        {/* Title */}
        <motion.h2
          className="flex items-center gap-3 mb-6 text-2xl font-bold text-gray-800 sm:text-3xl md:text-4xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <FaLightbulb className="text-yellow-500" />
          Light Control - {slug || "Unknown Room"}
        </motion.h2>

        {loading ? (
          <motion.div
            className="flex flex-col items-center justify-center h-64 text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin" />
            <motion.p className="mt-4 text-sm font-medium animate-pulse">
              Fetching light control data...
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Mode Switch */}
            <div className="flex items-center gap-4 mt-10">
              <MdOutlineMode className="text-xl text-gray-700" />
              <span className="text-lg font-medium">
                Mode: {mode.toUpperCase()}
              </span>
              <button
                onClick={toggleMode}
                className="px-4 py-2 ml-5 text-white bg-gray-800 rounded-lg hover:bg-gray-600"
              >
                Switch to {mode === "manual" ? "AUTO" : "MANUAL"}
              </button>
            </div>

            {/* Brightness Controls */}
            {mode === "manual" && (
              <div className="p-5 bg-white shadow-md rounded-2xl">
                <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold">
                  <FaSun className="text-yellow-400" /> Set Brightness
                </h3>
                <div className="flex flex-wrap gap-4">
                  {brightnessLevels.map(({ label, value, icon }) => (
                    <motion.button
                      key={label}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateBrightness(value)}
                      className={`px-6 py-2 rounded-xl border font-medium flex items-center gap-2 ${
                        brightness === value
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {icon} {label}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Relay & Info */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Relay Status */}
              <div className="p-5 bg-white shadow-md rounded-2xl">
                <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold">
                  <FaBolt className="text-blue-600" /> Relay Status
                </h3>
                <motion.p className="flex items-center gap-2 mb-2 text-gray-700">
                  <FaPowerOff className={`${isRelayOn ? "text-green-500" : "text-red-500"}`} />
                  MAIN:{" "}
                  <motion.span
                    animate={{ color: isRelayOn ? "#16a34a" : "#dc2626" }}
                    className="font-semibold"
                  >
                    {isRelayOn ? "ON" : "OFF"}
                  </motion.span>
                </motion.p>
              </div>

              {/* System Info */}
              <div className="p-5 bg-white shadow-md rounded-2xl">
                <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold">
                  <FaUserShield className="text-purple-600" /> System Info
                </h3>

                <p className="flex items-center gap-2">
                  <FaSun className="text-yellow-500" /> Ambient Brightness: {ambientBrightness}
                </p>

                <p className="flex items-center gap-2">
                  <FaLightbulb className="text-orange-500" /> Bulb Brightness: {bulbBrightness}
                </p>

                <p className="flex items-center gap-2">
                  <FaRunning className="text-green-600" /> Motion Detected: {motionDetected ? "Yes" : "No"}
                </p>

                <p className="flex items-center gap-2">
                  <FaBolt className="text-blue-500" /> Power Consumption: {powerConsumption} W
                </p>

                <p className="flex items-center gap-2">
                  <FaUserShield className="text-gray-600" /> User Override: {userOverride ? "Yes" : "No"}
                </p>

                <p className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                  <MdUpdate /> Last Updated: {formattedTimestamp}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
}
