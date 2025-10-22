import { useState, useEffect } from "react";
import axios from "axios";
import Toast from "./Toast";
import { motion } from "framer-motion";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

export default function CourseList({ onEdit, onReady, searchQuery = "" }) {
  const [courses, setCourses] = useState([]);
  const [toast, setToast] = useState(null);

  const fetchCourses = async () => {
    try {
      const endpoint = searchQuery
        ? `/api/admin/courses/search?q=${encodeURIComponent(searchQuery)}`
        : `/api/admin/courses`;
      const res = await axios.get(endpoint);
      setCourses(res.data);
    } catch (err) {
      const raw = err.response?.data;
      const message =
        typeof raw === "string"
          ? raw
          : typeof raw?.message === "string"
          ? raw.message
          : "❌ Failed to load courses";
      setToast(message);
    }
  };

  useEffect(() => {
    fetchCourses();
    if (typeof onReady === "function") {
      onReady(fetchCourses);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await axios.delete(`/api/admin/courses/${id}`);
      setCourses((prev) => prev.filter((c) => c.id !== id));
      setToast("✅ Course deleted successfully!");
    } catch (err) {
      const raw = err.response?.data;
      const message =
        typeof raw === "string"
          ? raw
          : typeof raw?.message === "string"
          ? raw.message
          : "❌ Error deleting course";
      setToast(message);
    }
  };

  return (
    <div className="w-full max-w-6xl p-6 mx-auto bg-white shadow-lg rounded-2xl">
      <h2 className="mb-6 text-3xl font-extrabold text-center text-indigo-600">
        All Online Courses
      </h2>

      {courses.length === 0 ? (
        <p className="text-center text-gray-500">No courses found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <motion.div
              key={course.id}
              whileHover={{ scale: 1.03 }}
              className="overflow-hidden transition-all bg-white shadow-md rounded-xl"
            >
              <img
                src={`http://localhost:8080${course.imageUrl}`}
                alt={course.title}
                onError={(e) => (e.target.src = "/placeholder.jpg")}
                className="object-cover w-full h-40"
              />
              <div className="p-4 space-y-2">
                <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-500">{course.level}</p>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {course.description}
                </p>
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

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}