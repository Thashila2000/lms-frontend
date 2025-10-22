import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import AdminNavbar from "../Components/Admin_navbar";
import AddCategory from "../Components/AddCategory";
import CategoryTable from "../Components/CategoryTable";
import AddDegree from "../Components/AddDegree";
import DegreeList from "../Components/DegreeList";
import { CategoryProvider } from "../Context/CategoryContext";

const ManageDegrees = () => {
  const [categories, setCategories] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null); 

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const catRes = await axios.get("http://localhost:8080/api/categories/all");
      const degRes = await axios.get("http://localhost:8080/api/degrees/all");

      console.log("📦 Categories from backend:", catRes.data);
      console.log("📦 Degrees from backend:", degRes.data);

      const parsedCategories = Array.isArray(catRes.data)
        ? catRes.data
        : catRes.data.categories || [];

      const parsedDegrees = Array.isArray(degRes.data)
        ? degRes.data
        : degRes.data.degrees || [];

      setCategories(parsedCategories);
      setDegrees(parsedDegrees);
    } catch (err) {
      console.error("❌ Failed to fetch data:", err);
    }
  };

  // Trigger edit mode (pass category to form)
  const handleEditCategory = (category) => {
    setEditingCategory(category);
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/categories/delete/${id}`);
      await fetchAll();
    } catch (err) {
      console.error("❌ Failed to delete category:", err);
    }
  };

  const handleEditDegree = async (updatedDegree) => {
    try {
      await axios.put(
        `http://localhost:8080/api/degrees/update/${updatedDegree.id}`,
        updatedDegree
      );
      await fetchAll();
    } catch (err) {
      console.error("❌ Failed to update degree:", err);
    }
  };

  const handleDeleteDegree = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/degrees/delete/${id}`);
      await fetchAll();
    } catch (err) {
      console.error("❌ Failed to delete degree:", err);
    }
  };

  return (
    <>
      <AdminNavbar />
      <CategoryProvider>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-8 px-4 mt-24 ml-64 max-w-7xl"
        >
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="pb-1 mb-6 text-4xl font-extrabold leading-tight text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-600"
          >
            Manage Degrees
          </motion.h1>

          {/* Category Section */}
          <AddCategory
            onRefresh={fetchAll}
            editingCategory={editingCategory} // Pass to form
            setEditingCategory={setEditingCategory} // Allow cancel/reset
          />
          <CategoryTable
            categories={categories}
            onEdit={handleEditCategory} // Triggers edit mode
            onDelete={handleDeleteCategory}
            onRefresh={fetchAll}
          />

          {/* Degree Section */}
          <AddDegree onRefresh={fetchAll} />
          <DegreeList
            degrees={degrees}
            onEdit={handleEditDegree}
            onDelete={handleDeleteDegree}
            onRefresh={fetchAll}
          />
        </motion.div>
      </CategoryProvider>
    </>
  );
};

export default ManageDegrees;