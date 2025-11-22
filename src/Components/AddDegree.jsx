import React, { useState, useContext } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import { FaUniversity, FaPlusCircle } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { CategoryContext } from "../Context/CategoryContext";

const AddDegree = ({ onRefresh }) => {
  const { categories, fetchCategories } = useContext(CategoryContext);
  const [formData, setFormData] = useState({ name: "", categoryId: "" });

  const handleChange = (e) => {
    console.log("Changed:", e.target.name, e.target.value); // 🧪 debug
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.categoryId) {
      toast.error("⚠️ Please fill in all fields before submitting.", { autoClose: 3000 });
      return;
    }

    const payload = {
      name: formData.name,
      categoryId: Number(formData.categoryId),
    };

    console.log("Selected category:", formData.categoryId);
    console.log("Submitting degree payload:", payload);

    try {
      await axios.post("http://localhost:8080/api/degrees/add", payload);
      toast.success("🎓 Degree added successfully!", { autoClose: 3000 });
      setFormData({ name: "", categoryId: "" });
      fetchCategories();
      onRefresh?.();
    } catch (err) {
      console.error("Error adding degree:", err.response?.data || err.message);
      toast.error("❌ Failed to add degree. Check console for details.", { autoClose: 3000 });
    }
  };

  return (
    <div className="flex items-start justify-center w-full px-4 pt-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-xl p-6 border border-gray-200 shadow-md h-[500px] rounded-xl bg-gradient-to-br from-indigo-50 to-blue-100"
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <FaUniversity className="text-xl text-blue-700" />
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-700">
            Add New Badge
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Degree Name */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Degree/Program name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. DSE25.1"
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block mb-3 text-sm font-medium text-gray-700">
              Select Category
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md mb-7 focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Choose Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            type="submit"
            className="flex items-center justify-center w-full gap-2 px-5 py-2 font-semibold text-white rounded-md bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:shadow-md"
          >
            <FaPlusCircle className="text-sm" />
            Add Degree
          </motion.button>
        </form>

        <p className="mt-4 text-xs text-center text-gray-600">
          ⚙️ Make sure categories are added before assigning new degrees.
        </p>

        <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />
      </motion.div>
    </div>
  );
};

export default AddDegree;