import React from "react";
import { motion } from "framer-motion";
import { FaBook } from "react-icons/fa";

const SubjectCards = ({ subject }) => {
  return (
     <motion.div
    whileHover={{ scale: 1.03 }}
    className="p-4 border border-gray-200 shadow-md bg-gradient-to-br from-indigo-100 via-purple-100 to-white rounded-xl"
  >

      {/* Subject Header */}
      <div className="flex items-center gap-3 mb-2 ">
        <FaBook className="text-xl text-indigo-600" />
        <h2 className="text-lg font-bold text-gray-800">{subject.name}</h2>
      </div>

      {/* Subject Details */}
      <div className="flex flex-col gap-1">
        {/* Category Badge */}
        {subject.category?.name && (
          <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-md">
            Category: {subject.category.name}
          </span>
        )}

        {/* Degree Badge */}
        {subject.degree?.name && (
          <span className="inline-block px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-md">
            Degree: {subject.degree.name}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default SubjectCards;