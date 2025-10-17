import { useState, useEffect } from "react";
import axios from "axios";
import Toast from "./Toast";
import { motion } from "framer-motion";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

export default function CourseList({ onEdit }) {
  const [courses, setCourses] = useState([]);
  const [toast, setToast] = useState(null);

  const fetchCourses = async () => {
    const res = await axios.get("/api/admin/courses");
    setCourses(res.data);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await axios.delete(`/api/admin/courses/${id}`);
      setCourses((prev) => prev.filter((c) => c.id !== id));
      setToast("✅ Course deleted successfully!");
    } catch (err) {
      setToast("❌ Error deleting course");
    }
  };

  return (
    <div className="w-full max-w-6xl p-6 mx-auto shadow-lg bg-gradient-to-br from-white to-blue-50 rounded-2xl">
      <h2 className="mb-6 text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
        All Courses
      </h2>

      {courses.length === 0 ? (
        <p className="text-center text-gray-500">No courses available yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <motion.div
              key={course.id}
              whileHover={{ scale: 1.03 }}
              className="overflow-hidden transition-all bg-white shadow-md rounded-2xl hover:shadow-xl"
            >
              <img
                src={course.imageUrl || "/placeholder.jpg"}
                alt={course.title}
                className="object-cover w-full h-40 transition-transform duration-300 hover:scale-105"
              />

              <div className="p-4 space-y-2">
                <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-500">{course.level}</p>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {course.description}
                </p>

                {/* Tags */}
                {course.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {course.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between mt-4">
                  <button
                    onClick={() => onEdit?.(course)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-yellow-600 transition-all border border-yellow-500 rounded-lg hover:bg-yellow-500 hover:text-white"
                  >
                    <FaEdit /> Edit
                  </button>

                  <button
                    onClick={() => handleDelete(course.id)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-red-600 transition-all border border-red-500 rounded-lg hover:bg-red-500 hover:text-white"
                  >
                    <FaTrashAlt /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  );
}
