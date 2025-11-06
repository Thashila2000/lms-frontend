import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaSave,
  FaBook,
  FaUserGraduate,
  FaClipboardList,
  FaStar,
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
        transition={{ duration: 0.6 }}
       className="flex flex-col justify-start w-full h-full px-5 pt-5 pb-0 overflow-hidden border border-gray-200 shadow-xl bg-gradient-to-br from-indigo-50 to-blue-100 bg-white/80 backdrop-blur-md rounded-2xl"

      >
        <h2 className="flex items-center justify-center mb-3 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
          <FaClipboardList className="mr-2 text-blue-600" />
          Add Student Result
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
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
            className="flex items-center justify-center w-full gap-2 px-4 py-2 text-base font-semibold text-white transition-all rounded-lg shadow-md bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:shadow-xl"
          >
            <FaSave /> Save Result
          </motion.button>
        </form>
      </motion.div>

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