import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBookOpen } from "react-icons/fa";
import LandingNavbar from "./LandingNavbar";

const OnlineCourseDisplay = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/courses")
      .then((res) => {
        setCourses(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching courses:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <LandingNavbar />
        <div className="py-20 text-xl font-semibold text-center text-indigo-600 animate-pulse">
          Loading courses...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <LandingNavbar />

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="pb-10 text-center pt-28"
      >
        <h1 className="flex items-center justify-center mb-3 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
          <FaBookOpen className="mr-3 text-5xl text-blue-600" />
          Explore Our Courses
        </h1>
        <p className="text-gray-600">Learn, grow, and master your skills online.</p>
      </motion.div>

      {/* Course Grid */}
      <div className="px-6 pb-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          {courses.map((course, index) => (
            <motion.div
  key={course.id}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * 0.08 }}
  whileHover={{
    scale: 1.05,
    boxShadow: "0px 10px 25px rgba(99,102,241,0.25)",
  }}
  className="overflow-hidden transition-all border shadow-lg bg-white/80 backdrop-blur-md border-white/40 rounded-2xl hover:shadow-xl h-[320px] flex flex-col"
>
  <div className="relative">
    <img
      src={`http://localhost:8080${course.imageUrl}`}
      alt={course.title}
      onError={(e) => (e.target.src = "/placeholder.jpg")}
      className="object-cover w-full h-40 rounded-t-2xl"
    />
    <div className="absolute px-2 py-1 text-xs font-semibold text-white rounded-md shadow-md top-2 right-2 bg-gradient-to-r from-indigo-500 to-purple-500">
      {course.level}
    </div>
  </div>

  <div className="flex flex-col justify-between h-full p-4">
    <div>
      <h2 className="text-lg font-bold text-gray-800 line-clamp-1">
        {course.title}
      </h2>
      <p className="mt-2 text-sm text-gray-600 line-clamp-3">
        {course.description}
      </p>
    </div>

    <Link
      to={`/courses/${course.id}`}
      className="inline-block w-full px-4 py-2 mt-4 text-sm font-semibold text-center text-white transition-all rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:shadow-md hover:from-blue-700 hover:to-purple-700"
    >
      View Details
    </Link>
  </div>
</motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default OnlineCourseDisplay;
