import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const LoginPage = () => {
  const [index, setIndex] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      indexNumber: index,
      password: password,
    };

    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", payload);

      if (res.data.message === "Login successful.") {
        localStorage.setItem("studentIndex", res.data.indexNumber);
        localStorage.setItem("studentName", res.data.name);
        toast.success("Login successful!");
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        toast.error(res.data.message || "Login failed.");
      }
    } catch (err) {
      toast.error("Something went wrong. Try again later.");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen px-4 overflow-hidden bg-gradient-to-br from-blue-100 via-indigo-100 to-white">
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

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-8 bg-white shadow-2xl rounded-xl backdrop-blur-md"
      >
        {/* Header */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 text-2xl font-bold text-center text-blue-700"
        >
          LMS Login
        </motion.h2>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="space-y-5"
        >
          {/* Index Number */}
          <div>
            <label htmlFor="index" className="block mb-1 text-sm font-medium text-gray-700">
              Index Number
            </label>
            <input
              type="text"
              id="index"
              name="index"
              value={index}
              onChange={(e) => setIndex(e.target.value)}
              placeholder="e.g. 2023ICT123"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white transition-transform duration-300 rounded-md bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg"
          >
            Sign In
          </motion.button>
        </motion.form>

        {/* Contact Note */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-xs text-center text-gray-500"
        >
          <p>Forgot your password? Contact your LMS administrator:</p>
          <p className="flex items-center justify-center mt-1 text-sm text-blue-600">
            <a href="mailto:adminbrighfuture@gmail.com" className="hover:underline">
              adminbrighfuture@gmail.com
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

export default LoginPage;