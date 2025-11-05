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
        className="relative w-full max-w-3xl p-8 mx-auto mt-10 overflow-hidden border shadow-2xl rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-100"
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

       <form onSubmit={handleSubmit} className="space-y-4">
  {/* Index Number */}
  <div>
    <label className="flex items-center gap-2 font-medium text-gray-700">
      <FaUserGraduate className="text-indigo-600" /> Index Number
    </label>
    <input
      type="text"
      name="indexNumber"
      value={formData.indexNumber}
      onChange={handleChange}
      placeholder="Enter student index number"
      className="w-full px-3 py-2 mt-1 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400"
      required
    />
  </div>

  {/* Subject Name */}
  <div>
    <label className="flex items-center gap-2 font-medium text-gray-700">
      <FaBook className="text-purple-600" /> Subject Name
    </label>
    <input
      type="text"
      name="subjectName"
      value={formData.subjectName}
      onChange={handleChange}
      placeholder="Enter subject name"
      className="w-full px-3 py-2 mt-1 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400"
      required
    />
  </div>

  {/* Coursework Grade */}
  <div>
    <label className="flex items-center gap-2 font-medium text-gray-700">
      <FaClipboardList className="text-blue-600" /> Coursework Grade
    </label>
    <input
      type="text"
      name="courseworkGrade"
      value={formData.courseworkGrade}
      onChange={handleChange}
      placeholder="e.g. A, B, C"
      className="w-full px-3 py-2 mt-1 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
      required
    />
  </div>

  {/* Exam Grade */}
  <div>
    <label className="flex items-center gap-2 font-medium text-gray-700">
      <FaClipboardList className="text-pink-600" /> Exam Grade
    </label>
    <input
      type="text"
      name="examGrade"
      value={formData.examGrade}
      onChange={handleChange}
      placeholder="e.g. A, B, C"
      className="w-full px-3 py-2 mt-1 border rounded-lg shadow-sm focus:ring-2 focus:ring-pink-400"
      required
    />
  </div>

  {/* GPA */}
  <div>
    <label className="flex items-center gap-2 font-medium text-gray-700">
      <FaStar className="text-green-600" /> GPA
    </label>
    <input
      type="number"
      step="0.01"
      name="gpa"
      value={formData.gpa}
      onChange={handleChange}
      placeholder="Enter GPA (e.g. 3.75)"
      className="w-full px-3 py-2 mt-1 border rounded-lg shadow-sm focus:ring-2 focus:ring-green-400"
      required
    />
  </div>

  {/* Submit Button */}
  <motion.button
    whileTap={{ scale: 0.95 }}
    type="submit"
    className="flex items-center justify-center w-full gap-2 px-4 py-2 text-white transition-all rounded-lg shadow-md bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:shadow-xl"
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