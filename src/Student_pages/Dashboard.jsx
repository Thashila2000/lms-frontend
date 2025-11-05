import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaUserGraduate } from "react-icons/fa";
import StudentNavbar from "../Components/StudentNavbar";
import SubjectCards from "../Components/SubjectCards";
import View_Schedule from "../Components/View_Schedule";

const Dashboard = () => {
  const studentName = localStorage.getItem("studentName") || "Student";
  const indexNumber = localStorage.getItem("studentIndex");
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (indexNumber) {
      setLoading(true);
      axios
        .get(`http://localhost:8080/api/auth/subjects/${indexNumber}`)
        .then((res) => setSubjects(res.data))
        .catch((err) => console.error("❌ Failed to fetch subjects:", err))
        .finally(() => setLoading(false));
    }
  }, [indexNumber]);

  //  Deduplicate subjects by name + code
  const deduplicatedSubjects = React.useMemo(() => {
    const seen = new Set();
    return subjects.filter((subject) => {
      const key = `${subject.name}|${subject.code}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [subjects]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white/70 via-indigo-50/70 to-purple-50/70">
      {/* Navbar */}
      <div className="h-20">
        <StudentNavbar />
      </div>

      {/* Main Grid */}
      <div className="flex h-[calc(100vh-5rem)] overflow-hidden">
        {/* Left Sidebar: Subject Cards */}
        <div className="w-1/4 p-4 overflow-y-auto bg-white shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-indigo-900">Your Subjects</h2>
          {loading ? (
            <p className="text-gray-500">Loading subjects...</p>
          ) : deduplicatedSubjects.length === 0 ? (
            <p className="text-gray-500">No subjects assigned.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {deduplicatedSubjects.map((subject) => (
                <SubjectCards key={subject.id} subject={subject} />
              ))}
            </div>
          )}
        </div>

        {/* Right Content: Greeting + Schedule */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Greeting Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-10 text-center"
          >
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center justify-center gap-2 text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600"
            >
              <FaUserGraduate className="text-3xl text-indigo-600" />
              Welcome, {studentName}!
            </motion.h1>
          </motion.div>

          {/* Schedule / Task View */}
          <div className="mt-[-20px]">
           <View_Schedule indexNumber={indexNumber} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;