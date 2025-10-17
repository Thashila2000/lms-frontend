import { useState, useEffect } from "react";
import axios from "axios";
import Toast from "./Toast";
import { motion } from "framer-motion";
import { FaBook, FaTags, FaUpload, FaLevelUpAlt, FaCheckCircle } from "react-icons/fa";

export default function CourseForm({ existingCourse, onSave }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    level: "",
    tags: "",
    prerequisites: "",
    imageUrl: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (existingCourse) {
      setForm({
        ...existingCourse,
        tags: existingCourse.tags.join(","),
        prerequisites: existingCourse.prerequisites.join(","),
      });
      setPreview(existingCourse.imageUrl);
    }
  }, [existingCourse]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleImageUpload = async () => {
    const formData = new FormData();
    formData.append("file", imageFile);
    const res = await axios.post("/api/admin/courses/upload-image", formData);
    return res.data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = form.imageUrl;
      if (imageFile) imageUrl = await handleImageUpload();

      const payload = {
        ...form,
        imageUrl,
        tags: form.tags.split(",").map((t) => t.trim()),
        prerequisites: form.prerequisites.split(",").map((p) => p.trim()),
      };

      if (existingCourse) {
        await axios.put(`/api/admin/courses/${existingCourse.id}`, payload);
        setToast("Course updated successfully!");
      } else {
        await axios.post("/api/admin/courses", payload);
        setToast("Course added successfully!");
      }

      setForm({
        title: "",
        description: "",
        level: "",
        tags: "",
        prerequisites: "",
        imageUrl: "",
      });
      setImageFile(null);
      setPreview(null);
      onSave?.();
    } catch (err) {
      setToast(err.response?.data || "Error saving course");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-3xl p-8 mx-auto shadow-xl bg-gradient-to-br from-indigo-50 to-blue-100 rounded-2xl"
    >
      <h2 className="flex items-center justify-center mb-6 text-2xl font-bold text-indigo-700">
        <FaBook className="mr-2 text-indigo-600" />
        {existingCourse ? "Edit Course" : "Add New Course"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2"
      >
        <div className="sm:col-span-2">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Course Title
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter course title"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Write a short course description..."
            rows={3}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Level <FaLevelUpAlt className="inline ml-1 text-indigo-500" />
          </label>
          <select
            name="level"
            value={form.level}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          >
            <option value="">Select Level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Tags <FaTags className="inline ml-1 text-indigo-500" />
          </label>
          <input
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="e.g., React, JavaScript"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Prerequisites
          </label>
          <input
            name="prerequisites"
            value={form.prerequisites}
            onChange={handleChange}
            placeholder="e.g., HTML, CSS"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Upload Image <FaUpload className="inline ml-1 text-indigo-500" />
          </label>
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
          />
          {preview && (
            <motion.img
              src={preview}
              alt="Preview"
              className="object-cover w-40 h-40 mt-3 border rounded-lg shadow-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          )}
        </div>

        <div className="flex justify-center sm:col-span-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="flex items-center justify-center w-full px-6 py-3 text-sm font-semibold text-white transition-all rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 sm:w-1/2"
          >
            <FaCheckCircle className="mr-2" />
            {existingCourse ? "Update Course" : "Add Course"}
          </motion.button>
        </div>
      </form>

      <Toast message={toast} onClose={() => setToast(null)} />
    </motion.div>
  );
}
