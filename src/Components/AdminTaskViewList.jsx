import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaTrashAlt, FaEdit, FaClock, FaTasks } from "react-icons/fa";

function ViewScheduleList({ onEdit, refreshTrigger }) {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    duration: "",
    priority: 1,
    startTime: "",
    dependencies: [],
  });

  useEffect(() => {
    fetchTasks();
  }, [refreshTrigger]);

  const fetchTasks = async () => {
    const indexNumber = localStorage.getItem("studentIndex");
    if (!indexNumber) {
      console.warn("Missing studentIndex in localStorage");
      return;
    }

    try {
      const degreeRes = await fetch(`http://localhost:8080/api/auth/degree?indexNumber=${indexNumber}`);
      const degreeId = await degreeRes.json();

      if (!degreeId || typeof degreeId !== "number") {
        console.warn("Invalid degreeId:", degreeId);
        return;
      }

      const taskRes = await fetch(`http://localhost:8080/api/tasks/schedule?degreeId=${degreeId}`);
      const taskData = await taskRes.json();

      if (Array.isArray(taskData)) {
        const sorted = [...taskData].sort((a, b) => new Date(a.computedStart) - new Date(b.computedStart));
        setTasks(sorted);
      } else {
        console.warn("Expected array but got:", taskData);
        setTasks([]);
      }
    } catch (error) {
      console.error("Error fetching schedule:", error);
      setTasks([]);
    }
  };

  const formatTime = (iso) => {
    if (!iso) return "Unscheduled";
    const date = new Date(iso);
    return date.toLocaleString("en-US", {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      day: "numeric",
      month: "short",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this task?");
    if (!confirmed) return;

    try {
      const response = await fetch(`http://localhost:8080/api/tasks/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setTasks((prev) => prev.filter((t) => t.id !== id));
        if (editingTask?.id === id) {
          setEditingTask(null);
          resetEditData();
        }
      } else {
        alert("Failed to delete task.");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const startEditing = (task) => {
    setEditingTask(task);
    setEditData({
      name: task.name,
      duration: task.duration,
      priority: task.priority,
      startTime: task.startTime,
      dependencies: task.dependencies || [],
    });
    onEdit(task);
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/tasks/${editingTask.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        fetchTasks(); // Refresh after update
        setEditingTask(null);
        resetEditData();
      } else {
        alert("Failed to update task.");
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const resetEditData = () => {
    setEditData({
      name: "",
      duration: "",
      priority: 1,
      startTime: "",
      dependencies: [],
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md p-6 mx-auto shadow-lg bg-gradient-to-br from-indigo-50 to-blue-100 rounded-2xl"
    >
      <h3 className="flex items-center justify-center mb-5 text-xl font-semibold text-indigo-700">
        <FaTasks className="mr-2 text-indigo-600" /> Scheduled Tasks
      </h3>

      <div className="space-y-3 overflow-y-auto max-h-[450px] scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-indigo-100">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <motion.div
              key={task.id}
              whileHover={{ scale: 1.03 }}
              className="p-4 transition-all duration-300 bg-white border border-indigo-100 shadow-sm rounded-xl hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-base font-semibold text-gray-800">{task.name}</h4>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    task.priority === 1
                      ? "bg-green-100 text-green-600"
                      : task.priority === 2
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  Priority {task.priority}
                </span>
              </div>
              <p className="text-sm text-gray-600">Duration: {task.duration}h</p>
              <p className="flex items-center mt-1 text-sm text-gray-600">
                <FaClock className="mr-1 text-indigo-500" /> {formatTime(task.startTime)}
              </p>
              <div className="flex justify-end gap-3 mt-3">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => startEditing(task)}
                  className="flex items-center px-3 py-1.5 text-xs font-medium text-white transition-all bg-yellow-500 rounded-lg hover:bg-yellow-600"
                >
                  <FaEdit className="mr-1" /> Edit
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDelete(task.id)}
                  className="flex items-center px-3 py-1.5 text-xs font-medium text-white transition-all bg-red-500 rounded-lg hover:bg-red-600"
                >
                  <FaTrashAlt className="mr-1" /> Delete
                </motion.button>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="py-10 text-center text-gray-500">No tasks found.</p>
        )}
      </div>

      {editingTask && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4 mt-6 bg-white border-t border-indigo-200 shadow-inner rounded-xl"
        >
          <h4 className="mb-3 text-sm font-semibold text-indigo-700">
            Editing: {editingTask.name}
          </h4>
          <input
            type="text"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            placeholder="Task name"
            className="w-full px-3 py-2 mb-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
          <input
            type="number"
            value={editData.duration}
            onChange={(e) =>
              setEditData({ ...editData, duration: parseInt(e.target.value) || 0 })
            }
            placeholder="Duration (hours)"
            className="w-full px-3 py-2 mb-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
          <input
            type="number"
            value={editData.priority}
            onChange={(e) =>
              setEditData({ ...editData, priority: parseInt(e.target.value) || 1 })
            }
            placeholder="Priority"
            className="w-full px-3 py-2 mb-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
          <input
            type="datetime-local"
            value={editData.startTime}
            onChange={(e) => setEditData({ ...editData, startTime: e.target.value })}
            className="w-full px-3 py-2 mb-3 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleUpdate}
            className="w-full px-4 py-2 text-sm font-semibold text-white transition-all bg-indigo-600 rounded-lg hover:bg-indigo-700"
           >
            💾 Save Changes
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}

export default ViewScheduleList;