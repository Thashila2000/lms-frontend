import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaTable, FaBookOpen, FaGraduationCap, FaChartBar } from "react-icons/fa";
import { MdPendingActions } from "react-icons/md";
import StudentNavbar from "../Components/StudentNavbar";

const StudentResultsDisplay = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const indexNumber = localStorage.getItem("studentIndex");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/results/${indexNumber}`);
        setResults(response.data);
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };

    if (indexNumber) fetchResults();
  }, [indexNumber]);

  return (
    <>
      <StudentNavbar />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-6xl p-8 mx-auto mt-24 mb-16 border border-gray-200 shadow-xl bg-white/70 backdrop-blur-lg rounded-2xl"
      >
        {/* Header Section */}
        <div className="flex flex-col items-center justify-center mb-8 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center w-16 h-16 mb-4 text-white rounded-full shadow-lg bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600"
          >
            <FaGraduationCap className="text-3xl" />
          </motion.div>

          <h3 className="flex items-center justify-center gap-3 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600">
  <          FaChartBar className="text-4xl text-purple-600" />
                My Academic Results
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Index Number:{" "}
            <span className="font-semibold text-gray-800">{indexNumber}</span>
          </p>
        </div>

        {/* Results Section */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-10 text-gray-500"
          >
            <MdPendingActions className="mb-2 text-4xl text-indigo-500 animate-spin" />
            <p>Loading your results...</p>
          </motion.div>
        ) : results.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-10 text-gray-500"
          >
            <FaBookOpen className="mb-2 text-4xl text-indigo-500" />
            <p>No results found for your account.</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="overflow-x-auto shadow-md rounded-xl"
          >
            <table className="w-full overflow-hidden text-sm text-left text-gray-700 border border-gray-200 rounded-xl">
              <thead className="text-sm text-white uppercase bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600">
                <tr>
                  <th className="px-6 py-3">Subject</th>
                  <th className="px-6 py-3">Coursework Grade</th>
                  <th className="px-6 py-3">Exam Grade</th>
                  <th className="px-6 py-3">GPA</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="transition-colors bg-white border-b hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50"
                  >
                    <td className="px-6 py-3 font-medium text-gray-800">
                      {result.subjectName}
                    </td>
                    <td className="px-6 py-3">{result.courseworkGrade}</td>
                    <td className="px-6 py-3">{result.examGrade}</td>
                    <td className="px-6 py-3 font-semibold text-indigo-700">
                      {result.gpa}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </motion.div>
    </>
  );
};

export default StudentResultsDisplay;
