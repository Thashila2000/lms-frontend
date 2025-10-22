import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaSave,
  FaBook,
  FaUserGraduate,
  FaClipboardList,
  FaStar,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddResultForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    indexNumber: "",
    subjectName: "",
    courseworkGrade: "",
    examGrade: "",
    gpa: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8080/api/results/add", formData);
      toast.success(
        <div className="flex items-center gap-2">
        
          <span>Result saved successfully!</span>
        </div>
      );
      if (onSubmit) onSubmit(formData);
      setFormData({
        indexNumber: "",
        subjectName: "",
        courseworkGrade: "",
        examGrade: "",
        gpa: "",
      });
    } catch (error) {
      console.error("Error saving result:", error);
      toast.error(
        <div className="flex items-center gap-2">
          <FaExclamationTriangle className="text-red-500" />
          <span>Failed to save result. Try again.</span>
        </div>
      );
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-3xl p-8 mx-auto mt-10 overflow-hidden border shadow-2xl rounded-2xl bg-white/80 backdrop-blur-xl border-gradient-to-r from-blue-300 via-purple-300 to-indigo-300"
      >
        {/* Floating Glow Effect */}
        <motion.div
          animate={{ opacity: [0.5, 0.8, 0.5], scale: [1, 1.05, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -inset-10 bg-gradient-to-br from-white/60 via-blue-50/60 to-purple-50/60 opacity-30 blur-3xl -z-10"
        />

        <h3 className="mb-6 text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700">
          <span className="inline-flex items-center justify-center gap-2">
            <FaClipboardList className="text-indigo-600" />
            Add Student Result
          </span>
        </h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Index Number */}
          <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-3">
            <FaUserGraduate className="text-2xl text-indigo-600" />
            <input
              type="text"
              name="indexNumber"
              value={formData.indexNumber}
              onChange={handleChange}
              placeholder="Index Number"
              className="w-full px-4 py-3 text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </motion.div>

          {/* Subject Name */}
          <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-3">
            <FaBook className="text-2xl text-purple-600" />
            <input
              type="text"
              name="subjectName"
              value={formData.subjectName}
              onChange={handleChange}
              placeholder="Subject Name"
              className="w-full px-4 py-3 text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </motion.div>

          {/* Coursework Grade */}
          <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-3">
            <FaClipboardList className="text-2xl text-blue-600" />
            <input
              type="text"
              name="courseworkGrade"
              value={formData.courseworkGrade}
              onChange={handleChange}
              placeholder="Coursework Grade (e.g. A, B, C)"
              className="w-full px-4 py-3 text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </motion.div>

          {/* Exam Grade */}
          <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-3">
            <FaClipboardList className="text-2xl text-pink-600" />
            <input
              type="text"
              name="examGrade"
              value={formData.examGrade}
              onChange={handleChange}
              placeholder="Exam Grade (e.g. A, B, C)"
              className="w-full px-4 py-3 text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
          </motion.div>

          {/* GPA */}
          <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-3">
            <FaStar className="text-2xl text-green-600" />
            <input
              type="number"
              step="0.01"
              name="gpa"
              value={formData.gpa}
              onChange={handleChange}
              placeholder="GPA"
              className="w-full px-4 py-3 text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </motion.div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(99,102,241,0.4)" }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="flex items-center justify-center w-full gap-2 px-5 py-3 text-lg font-semibold text-white transition-all duration-300 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-700 hover:to-purple-700"
          >
            <FaSave />
            Save Result
          </motion.button>
        </form>
      </motion.div>

      {/* Toast Container outside layout box for proper positioning */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default AddResultForm;