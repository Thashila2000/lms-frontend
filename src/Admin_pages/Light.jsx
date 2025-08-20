import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { lightControlDB } from "../firebase";
import { motion } from "framer-motion";
import AdminNavbar from "../Components/Admin_navbar";

// React Icons
import { FaLightbulb, FaPowerOff, FaBolt, FaSun, FaUserShield } from "react-icons/fa";
import { MdUpdate, MdOutlineMode } from "react-icons/md";

const brightnessLevels = [
  { label: "Off", value: 0, icon: <FaPowerOff /> },
  { label: "Low", value: 85, icon: <FaLightbulb /> },
  { label: "Medium", value: 170, icon: <FaLightbulb /> },
  { label: "High", value: 255, icon: <FaBolt /> },
];

const getRelayStates = (brightness) => ({
  main: brightness > 0,
  level1: brightness >= 85,
  level2: brightness >= 170,
});

export default function Light_Control() {
  const { slug } = useParams();
  const [mode, setMode] = useState("manual");
  const [brightness, setBrightness] = useState(0);
  const [relayStates, setRelayStates] = useState(getRelayStates(0));
  const [ambientBrightness, setAmbientBrightness] = useState(0);
  const [powerConsumption, setPowerConsumption] = useState(0);
  const [userOverride, setUserOverride] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);

  const formattedTimestamp = useMemo(() => {
    if (!lastUpdated) return "—";
    const date = new Date(lastUpdated);
    return date.toLocaleString();
  }, [lastUpdated]);

  const updateBrightness = async (value) => {
    if (!slug) return;
    const relays = getRelayStates(value);

    setBrightness(value);
    setRelayStates(relays);

    try {
      const docRef = doc(lightControlDB, "classrooms", slug);
      await updateDoc(docRef, {
        "lightControl.mode": "manual",
        "lightControl.bulbBrightness": value,
        "lightControl.relayState": relays,
        "lightControl.timeStamp": new Date().toISOString(),
        "lightControl.userOverride": true,
      });
    } catch (error) {
      console.error("Failed to update brightness:", error);
    }
  };

  const toggleMode = async () => {
    if (!slug) return;
    const newMode = mode === "manual" ? "auto" : "manual";
    setMode(newMode);

    try {
      const docRef = doc(lightControlDB, "classrooms", slug);
      await updateDoc(docRef, { "lightControl.mode": newMode });
    } catch (error) {
      console.error("Failed to toggle mode:", error);
    }
  };

  useEffect(() => {
    if (!slug) {
      console.warn("Missing slug from URL. Cannot fetch document.");
      return;
    }

    const docRef = doc(lightControlDB, "classrooms", slug);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const control = data.lightControl || {};

        setMode(control.mode || "manual");
        setBrightness(control.bulbBrightness ?? 0);
        setRelayStates(
          control.relayState ?? getRelayStates(control.bulbBrightness ?? 0)
        );
        setAmbientBrightness(control.ambientBrightness ?? 0);
        setPowerConsumption(control.powerConsumption ?? 0);
        setUserOverride(control.userOverride ?? false);
        setLastUpdated(control.timeStamp || null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [slug]);

  return (
    <>
      <AdminNavbar />
      <div className="p-4 mt-16 ml-0 md:ml-64 md:p-8">
        {/* Title */}
        <motion.h2
          className="flex items-center gap-3 mb-6 text-2xl font-bold text-center text-gray-800 sm:text-3xl md:text-4xl md:text-left"
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
            <motion.div
              className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            />
            <motion.p
              className="mt-4 text-sm font-medium animate-pulse"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
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
                className="px-4 py-2 ml-5 text-white transition bg-gray-800 rounded-lg hover:bg-gray-600"
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
                {Object.entries(relayStates).map(([key, value], i) => (
                  <motion.p
                    key={key}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-2 mb-2 text-gray-700"
                  >
                    <FaPowerOff
                      className={`${
                        value ? "text-green-500" : "text-red-500"
                      }`}
                    />
                    {key.toUpperCase()}:{" "}
                    <motion.span
                      animate={{ color: value ? "#16a34a" : "#dc2626" }}
                      transition={{ duration: 0.5 }}
                      className="font-semibold"
                    >
                      {value ? "ON" : "OFF"}
                    </motion.span>
                  </motion.p>
                ))}
              </div>

              {/* System Info */}
              <div className="p-5 bg-white shadow-md rounded-2xl">
                <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold">
                  <FaUserShield className="text-purple-600" /> System Info
                </h3>
                <p className="flex items-center gap-2">
                  <FaSun className="text-yellow-500" /> Ambient Brightness:{" "}
                  {ambientBrightness}
                </p>
                <p className="flex items-center gap-2">
                  <FaBolt className="text-blue-500" /> Power Consumption:{" "}
                  {powerConsumption} W
                </p>
                <p className="flex items-center gap-2">
                  <FaUserShield className="text-gray-600" /> User Override:{" "}
                  {userOverride ? "Yes" : "No"}
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
