import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaUserGraduate, FaEnvelope, FaLock, FaIdBadge, FaUniversity } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    index: "",
    email: "",
    password: "",
    degreeName: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      fullName: formData.name,
      indexNumber: formData.index,
      email: formData.email,
      password: formData.password,
      role: "STUDENT",
      degreeName: formData.degreeName
    };

    try {
      const res = await axios.post("http://localhost:8080/api/auth/register", payload, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      console.log("Registration response:", res);
      toast.success(res.data || "Student registered successfully!");
      setFormData({ name: "", index: "", email: "", password: "", degreeName: "" });

    } catch (err) {
      console.error("Axios error:", err);

      if (err.response) {
        toast.error(`Server error (${err.response.status}): ${err.response.data}`);
      } else if (err.request) {
        toast.error("Network error: Could not reach backend.");
      } else {
        toast.error(`Unexpected error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-blue-100 via-indigo-100 to-white">
      {/* Floating Gradient Circles */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15, y: [0, -25, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute bg-blue-300 rounded-full w-80 h-80 blur-3xl top-10 left-10"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15, y: [0, 25, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
        className="absolute bg-purple-300 rounded-full w-96 h-96 blur-3xl bottom-10 right-10"
      />

      {/* Registration Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg p-8 bg-white shadow-2xl rounded-2xl backdrop-blur-md"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-6 space-y-2">
          <FaUserGraduate className="text-4xl text-blue-600" />
          <h2 className="pb-1 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-600">
            Register Page
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label htmlFor="name" className="block mb-1 text-sm font-semibold text-gray-700">
              Full Name
            </label>
            <div className="flex items-center px-3 py-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500">
              <FaUserGraduate className="text-gray-400" />
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Student's full name"
                className="w-full px-3 py-1 text-sm border-none outline-none"
                required
              />
            </div>
          </div>

          {/* Index Number */}
          <div>
            <label htmlFor="index" className="block mb-1 text-sm font-semibold text-gray-700">
              Index Number
            </label>
            <div className="flex items-center px-3 py-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-indigo-500">
              <FaIdBadge className="text-gray-400" />
              <input
                type="text"
                id="index"
                name="index"
                value={formData.index}
                onChange={handleChange}
                placeholder="e.g. 2023ICT123"
                className="w-full px-3 py-1 text-sm border-none outline-none"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-semibold text-gray-700">
              Email Address
            </label>
            <div className="flex items-center px-3 py-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-purple-500">
              <FaEnvelope className="text-gray-400" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="student@example.com"
                className="w-full px-3 py-1 text-sm border-none outline-none"
                required
              />
            </div>
          </div>

          {/* Degree Name */}
          <div>
            <label htmlFor="degreeName" className="block mb-1 text-sm font-semibold text-gray-700">
              Degree Name
            </label>
            <div className="flex items-center px-3 py-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-purple-500">
              <FaUniversity className="text-gray-400" />
              <input
                type="text"
                id="degreeName"
                name="degreeName"
                value={formData.degreeName}
                onChange={handleChange}
                placeholder="e.g. BSc in Computer Science"
                className="w-full px-3 py-1 text-sm border-none outline-none"
                required
              />
            </div>
          </div>

          {/* Temporary Password */}
          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-semibold text-gray-700">
              Temporary Password
            </label>
            <div className="flex items-center px-3 py-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500">
              <FaLock className="text-gray-400" />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Set a temporary password"
                className="w-full px-3 py-1 text-sm border-none outline-none"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <motion.button
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className={`w-full px-4 py-3 font-semibold text-white transition-all rounded-md shadow-md ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:shadow-lg hover:from-blue-700 hover:to-purple-700"
            }`}
          >
            {loading ? "Registering..." : "Register Student"}
          </motion.button>
        </form>

        {/* Note */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-xs text-center text-gray-500"
        >
          <p>🔒 Only LMS administrators can access this page to register new university students.</p>
          <p className="mt-2 text-sm font-medium text-blue-600">
            For support:{" "}
            <a href="mailto:admin.lms@gmail.com" className="underline hover:text-blue-800">
              admin.lms@gmail.com
            </a>
          </p>
        </motion.div>
      </motion.div>

      {/* Toast Container */}
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
    </div>
  );
};

export default Register;