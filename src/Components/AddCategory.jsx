import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaPlus, FaTrash, FaLayerGroup } from "react-icons/fa";
import { CategoryContext } from "../Context/CategoryContext";

const AddCategory = ({ onRefresh, editingCategory, setEditingCategory }) => {
  const [name, setName] = useState("");
  const [subjects, setSubjects] = useState([{ name: "", code: "" }]);
  const { fetchCategories } = useContext(CategoryContext);

  // Preload form when editing
  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
      setSubjects(editingCategory.subjects || [{ name: "", code: "" }]);
    } else {
      resetForm();
    }
  }, [editingCategory]);

  const resetForm = () => {
    setName("");
    setSubjects([{ name: "", code: "" }]);
  };

  const handleSubjectChange = (index, field, value) => {
    const updated = [...subjects];
    updated[index][field] = value;
    setSubjects(updated);
  };

  const addSubjectField = () => {
    setSubjects([...subjects, { name: "", code: "" }]);
  };

  const removeSubjectField = (index) => {
    const updated = subjects.filter((_, i) => i !== index);
    setSubjects(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await axios.put(`http://localhost:8080/api/categories/update/${editingCategory.id}`, {
          name,
          subjects,
        });
        toast.success("✅ Category updated!", { autoClose: 3000 });
      } else {
        await axios.post("http://localhost:8080/api/categories/add", {
          name,
          subjects,
        });
        toast.success("✅ Category and subjects added!", { autoClose: 3000 });
      }

      resetForm();
      setEditingCategory?.(null);
      fetchCategories?.();
      onRefresh?.();
    } catch (err) {
      toast.error("❌ Failed to save category.", { autoClose: 3000 });
      console.error(err);
    }
  };

  const handleCancel = () => {
    resetForm();
    setEditingCategory?.(null);
  };

  return (
    <div className="flex items-start justify-center w-full px-4 pt-6">
      <div className="w-full max-w-xl h-[800px] p-6 border border-gray-200 shadow-md rounded-xl bg-gradient-to-br from-white/60 via-blue-50/60 to-purple-50/60">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <FaLayerGroup className="text-2xl text-blue-700" />
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-700">
            {editingCategory ? "Edit Category" : "Add Category & Subjects"}
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Name */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Category Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. DSE"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Subjects */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Subjects
            </label>
            <div className="space-y-3">
              {subjects.map((subject, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={subject.name}
                    onChange={(e) =>
                      handleSubjectChange(index, "name", e.target.value)
                    }
                    placeholder="Subject Name"
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                  <input
                    type="text"
                    value={subject.code}
                    onChange={(e) =>
                      handleSubjectChange(index, "code", e.target.value)
                    }
                    placeholder="Subject Code"
                    className="w-1/3 px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                  {subjects.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSubjectField(index)}
                      className="px-2 text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addSubjectField}
                className="text-sm text-blue-600 hover:underline"
              >
                + Add another subject
              </button>
            </div>
          </div>

          {/* Submit & Cancel */}
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex items-center justify-center w-full gap-2 px-5 py-2 font-semibold text-white transition-transform rounded-md bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:scale-105"
            >
              <FaPlus className="text-sm" />
              {editingCategory ? "Update Category" : "Add Category"}
            </button>
            {editingCategory && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-md hover:text-gray-800"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <p className="mt-4 text-xs text-center text-gray-600">
          📁 {editingCategory ? "Update existing category and subjects." : "Add a category and its subjects in one go."}
        </p>
      </div>
    </div>
  );
};

export default AddCategory;