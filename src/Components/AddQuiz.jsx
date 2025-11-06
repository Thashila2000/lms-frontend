import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaClipboardList,
  FaLink,
  FaClock,
  FaCalendarAlt,
  FaPlusCircle,
} from "react-icons/fa";

function AddQuiz() {
  const { slug } = useParams(); 
  const [formUrl, setFormUrl] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [toast, setToast] = useState({ message: "", type: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      badgeSlug: slug.trim().toLowerCase(),
      formUrl,
      startTime,
      endTime,
    };

    try {
      const res = await fetch("http://localhost:8080/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setToast({ message: "✅ Quiz added successfully!", type: "success" });
        setFormUrl("");
        setStartTime("");
        setEndTime("");
      } else {
        const errorText = await res.text();
        setToast({ message: `⚠️ Failed to add quiz: ${errorText}`, type: "error" });
      }
    } catch {
      setToast({ message: "❌ Server error while adding quiz.", type: "error" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col justify-start w-full h-full px-5 pt-5 pb-0 overflow-hidden border border-gray-200 shadow-xl bg-gradient-to-br from-indigo-50 to-blue-100 bg-white/80 backdrop-blur-md rounded-2xl"
    >
      <h2 className="flex items-center justify-center mb-3 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
        <FaClipboardList className="mr-2 text-blue-600" />
        Add Quiz for Badge: {slug}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
        {/* Google Form URL */}
        <div>
          <label className="flex items-center gap-2 font-medium text-gray-700">
            <FaLink className="text-green-500" /> Google Form URL
          </label>
          <input
            type="url"
            required
            placeholder="https://docs.google.com/forms/..."
            value={formUrl}
            onChange={(e) => setFormUrl(e.target.value)}
            className="w-full px-3 py-2 mt-1 border rounded-lg shadow-sm focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Start Time */}
        <div>
          <label className="flex items-center gap-2 font-medium text-gray-700">
            <FaClock className="text-indigo-500" /> Start Time
          </label>
          <input
            type="datetime-local"
            required
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full px-3 py-2 mt-1 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* End Time */}
        <div>
          <label className="flex items-center gap-2 font-medium text-gray-700">
            <FaCalendarAlt className="text-pink-500" /> End Time
          </label>
          <input
            type="datetime-local"
            required
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full px-3 py-2 mt-1 border rounded-lg shadow-sm focus:ring-2 focus:ring-pink-400"
          />
        </div>

        {/* Submit Button */}
        <div className="mt-3 mb-0">
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="flex items-center justify-center w-full gap-2 px-4 py-2 text-base font-semibold text-white transition-all rounded-lg shadow-md bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:shadow-xl"
          >
            <FaPlusCircle /> Add Quiz
          </motion.button>
        </div>
      </form>

      {/* Toast Message */}
      {toast.message && (
        <div className="mt-4 text-sm text-center text-gray-700">
          {toast.message}
        </div>
      )}
    </motion.div>
  );
}

export default AddQuiz;