import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaTrashAlt, FaEdit, FaClock, FaTasks } from "react-icons/fa";

function ViewScheduleList({ badgeSlug, onEdit, refreshTrigger }) {
  const [tasks, setTasks] = useState([]);
  const [degreeId, setDegreeId] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    duration: "",
    priority: 1,
    startTime: "",
    dependencies: [],
  });

  // Resolve degreeId from badgeSlug
  useEffect(() => {
    if (!badgeSlug) return;

    const fetchDegreeId = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/degrees/byName/${badgeSlug}`);
        const degree = await res.json();
        if (degree?.id) {
          setDegreeId(degree.id);
        } else {
          console.warn("Invalid degree object from slug:", degree);
        }
      } catch (error) {
        console.error("Error fetching degreeId:", error);
      }
    };

    fetchDegreeId();
  }, [badgeSlug]);

  // Fetch tasks for resolved degreeId
  useEffect(() => {
    if (!degreeId) return;

    const fetchTasks = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/tasks/schedule?degreeId=${degreeId}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          const sorted = [...data].sort((a, b) => new Date(a.computedStart) - new Date(b.computedStart));
          setTasks(sorted);
        } else {
          setTasks([]);
        }
      } catch (error) {
        console.error("Error fetching schedule:", error);
        setTasks([]);
      }
    };

    fetchTasks();
  }, [degreeId, refreshTrigger]);

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

  const getStatusLabel = (task) => {
    const now = new Date();
    const start = new Date(task.computedStart);
    const end = new Date(task.computedEnd);

    if (now < start) return { label: "Upcoming", style: "bg-yellow-100 text-yellow-700" };
    if (now >= start && now <= end) return { label: "Active", style: "bg-green-100 text-green-700" };
    return { label: "Expired", style: "bg-gray-200 text-gray-600" };
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
        const updated = await response.json();
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
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
          tasks.map((task) => {
            const status = getStatusLabel(task);
            return (
              <motion.div
                key={task.id}
                whileHover={{ scale: 1.03 }}
                className="p-4 transition-all duration-300 bg-white border border-indigo-100 shadow-sm rounded-xl hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-base font-semibold text-gray-800">{task.name}</h4>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${status.style}`}>
                    {status.label}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Duration: {task.duration}h</p>
                <p className="flex items-center mt-1 text-sm text-gray-600">
                  <FaClock className="mr-1 text-indigo-500" /> Start: {formatTime(task.computedStart)}
                </p>
                <p className="flex items-center mt-1 text-sm text-gray-600">
                  <FaClock className="mr-1 text-purple-500" /> End: {formatTime(task.computedEnd)}
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
            );
          })
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
          <h4 className="mb-3 text-sm font-semibold text-indigo-700">Editing: {editingTask.name}</h4>
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
            onChange={(e) => setEditData({ ...editData, duration: parseInt(e.target.value) || 0 })}
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
            className="w-full px-3 py-2 mb-3 text-sm border rounded-lg focus:ring-indigo-400 focus:outline-none"
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