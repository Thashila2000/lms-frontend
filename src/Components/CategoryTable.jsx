import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

const CategoryTable = ({ categories = [], onEdit, onDelete, onRefresh, editingCategory }) => {
  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this category?");
    if (!confirmed) return;

    try {
      await onDelete(id);
      toast.success("🗑️ Category deleted!", { autoClose: 3000 });
      if (onRefresh) await onRefresh();
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("❌ Failed to delete category.", { autoClose: 3000 });
    }
  };

  const handleEdit = (category) => {
    try {
      onEdit(category);
      toast.info(`✏️ Editing category: ${category.name}`, { autoClose: 2000 });
    } catch (err) {
      console.error("Edit failed:", err);
      toast.error("❌ Failed to edit category.", { autoClose: 3000 });
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-10 overflow-x-auto shadow-xl rounded-2xl bg-white/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b rounded-t-3xl">
        <h3 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700">
          📚 Categories & Subjects
        </h3>
      </div>

      <table className="w-full text-sm border-collapse">
        <thead className="text-xs tracking-wide text-gray-700 uppercase bg-gradient-to-r from-purple-100 via-indigo-100 to-blue-100">
          <tr>
            <th className="px-6 py-3 text-left">Category</th>
            <th className="px-6 py-3 text-left">Subjects</th>
            <th className="px-6 py-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((cat) => {
            const isEditing = editingCategory?.id === cat.id;
            return (
              <tr
                key={cat.id}
                className={`transition-all duration-300 border-t hover:bg-indigo-100 ${
                  isEditing ? "bg-indigo-100" : "bg-white"
                }`}
              >
                <td className="px-6 py-3 font-semibold text-gray-800">{cat.name}</td>
                <td className="px-6 py-3">
                  {cat.subjects?.length > 0 ? (
                    <ul className="text-gray-700 list-disc list-inside">
                      {cat.subjects.map((sub, i) => (
                        <li key={i}>
                          {sub.name} <span className="text-gray-500">({sub.code})</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="italic text-gray-400">No subjects added</span>
                  )}
                </td>
                <td className="px-6 py-3 text-center">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="mr-4 text-indigo-600 transition-transform duration-200 hover:text-indigo-800 hover:scale-110"
                    title="Edit Category"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className={`text-red-600 hover:text-red-800 hover:scale-110 transition-transform duration-200 ${
                      isEditing ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    title="Delete Category"
                    disabled={isEditing}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            );
          })}

          {categories.length === 0 && (
            <tr>
              <td
                colSpan="3"
                className="px-6 py-6 italic text-center text-gray-500 bg-white rounded-b-2xl"
              >
                No categories available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable;
