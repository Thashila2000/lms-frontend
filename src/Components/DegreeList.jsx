import React from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const DegreeList = ({ degrees = [], onEdit, onDelete }) => {
  const navigate = useNavigate();

  const handleViewBadges = (name) => {
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    navigate(`/manage_badge/${slug}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-5xl p-6 mx-auto mt-10 border border-gray-200 shadow-lg bg-white/70 backdrop-blur-lg rounded-2xl"
    >
      <h3 className="mb-6 text-2xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600">
        🎓 Manage Degrees
      </h3>

      {Array.isArray(degrees) && degrees.length > 0 ? (
        <ul className="space-y-4">
          {degrees.map((deg, index) => (
            <motion.li
              key={deg.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-between px-5 py-4 transition-all duration-200 bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md hover:bg-indigo-100"
            >
              <div>
                <p className="text-lg font-semibold text-gray-800">{deg.name}</p>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleViewBadges(deg.name)}
                  className="p-2 text-green-600 transition duration-200 bg-green-100 rounded-full shadow-sm hover:bg-green-500 hover:text-white"
                  title="View Badges"
                >
                  <FaEye />
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onEdit(deg)}
                  className="p-2 text-blue-600 transition duration-200 bg-blue-100 rounded-full shadow-sm hover:bg-blue-500 hover:text-white"
                  title="Edit Degree"
                >
                  <FaEdit />
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onDelete(deg.id)}
                  className="p-2 text-red-600 transition duration-200 bg-red-100 rounded-full shadow-sm hover:bg-red-500 hover:text-white"
                  title="Delete Degree"
                >
                  <FaTrash />
                </motion.button>
              </div>
            </motion.li>
          ))}
        </ul>
      ) : (
        <div className="py-10 italic text-center text-gray-500">
          No degrees found. Add a new degree to get started!
        </div>
      )}
    </motion.div>
  );
};

export default DegreeList;