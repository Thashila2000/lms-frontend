import React from "react";
import { motion } from "framer-motion";
import {
  FaUserGraduate,
  FaChartLine,
  FaBookOpen,
  FaClipboardList,
} from "react-icons/fa";
import { MdSchool } from "react-icons/md";
import StudentNavbar from "../Components/StudentNavbar";

const Dashboard = () => {
  const studentName = localStorage.getItem("studentName") || "Student";

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" },
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white/70 via-indigo-50/70 to-purple-50/70">
      {/* Navbar */}
      <div className="h-20">
        <StudentNavbar />
      </div>

      {/* Greeting Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="px-6 pt-10 text-center"
      >
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center justify-center gap-2 mb-10 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600"
        >
          <FaUserGraduate className="text-5xl text-indigo-600" />
          Welcome, {studentName}!
        </motion.h1>
      </motion.div>

      {/* Dashboard Cards */}
      <div className="grid max-w-6xl grid-cols-1 gap-8 px-6 mx-auto mb-20 sm:grid-cols-2 lg:grid-cols-3">
        {/* Card 1 - View Results */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={0}
          whileHover={{ scale: 1.05 }}
          className="p-6 border border-gray-200 shadow-md bg-white/80 rounded-2xl backdrop-blur-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600">
              <FaClipboardList className="text-2xl text-white" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">View My Results</h3>
          <p className="mt-2 text-sm text-gray-600">
            Check your coursework, exam grades, and GPA progress.
          </p>
        </motion.div>

        {/* Card 2 - Subjects */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={1}
          whileHover={{ scale: 1.05 }}
          className="p-6 border border-gray-200 shadow-md bg-white/80 rounded-2xl backdrop-blur-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600">
              <FaBookOpen className="text-2xl text-white" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">My Subjects</h3>
          <p className="mt-2 text-sm text-gray-600">
            Explore the list of enrolled subjects and course details.
          </p>
        </motion.div>

        {/* Card 3 - GPA Performance */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={2}
          whileHover={{ scale: 1.05 }}
          className="p-6 border border-gray-200 shadow-md bg-white/80 rounded-2xl backdrop-blur-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600">
              <FaChartLine className="text-2xl text-white" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">GPA Performance</h3>
          <p className="mt-2 text-sm text-gray-600">
            Track your GPA trends and visualize performance insights.
          </p>
        </motion.div>

        {/* Card 4 - Academic Info */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={3}
          whileHover={{ scale: 1.05 }}
          className="p-6 border border-gray-200 shadow-md bg-white/80 rounded-2xl backdrop-blur-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600">
              <MdSchool className="text-2xl text-white" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Academic Info</h3>
          <p className="mt-2 text-sm text-gray-600">
            View details about your degree program and academic status.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
