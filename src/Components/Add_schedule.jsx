import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaTasks,
  FaClock,
  FaPlusCircle,
  FaTrashAlt,
  FaLink,
  FaCalendarAlt,
  FaSortAmountUp,
} from "react-icons/fa";
import AdminNavbar from "./Admin_navbar";
import ViewScheduleList from "./AdminTaskViewList";
import Toast from "./Toast"; 

function AddSchedule() {
  const { slug } = useParams();
  const [degreeId, setDegreeId] = useState(null);
  const [task, setTask] = useState({
    name: "",
    duration: "",
    priority: 1,
    startTime: "",
    dependencies: [],
  });
  const [allTasks, setAllTasks] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Toast state
  const [toast, setToast] = useState({ message: "", type: "" });

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  // Load Degree
  useEffect(() => {
    if (!slug) return;
    const fetchDegree = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/degrees/byName/${slug}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data?.id) setDegreeId(data.id);
      } catch {
        showToast("❌ Failed to load degree for this badge.", "error");
      }
    };
    fetchDegree();
  }, [slug]);

 useEffect(() => {
  if (!degreeId) return;

  const fetchTasks = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/tasks?degreeId=${degreeId}`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      setAllTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  fetchTasks();
}, [degreeId, refreshTrigger]);
 
  const hasDependencies = task.dependencies.length > 0;

  const availableTasks = useMemo(() => {
    const now = new Date();
    return allTasks.filter((t) => {
      if (!t.startTime) return true;
      const end = new Date(t.startTime);
      end.setHours(end.getHours() + t.duration);
      return end > now;
    });
  }, [allTasks]);

  // Auto adjust startTime based on dependencies
  useEffect(() => {
    if (hasDependencies) {
      const selectedDeps = allTasks.filter(
        (t) => task.dependencies.includes(t.id) && t.startTime
      );
      if (selectedDeps.length === 0) return;

      const endTimes = selectedDeps.map((dep) => {
        const start = new Date(dep.startTime);
        return new Date(start.getTime() + dep.duration * 60 * 60 * 1000);
      });

      const latest = new Date(Math.max(...endTimes.map((t) => t.getTime())));
      const formatted = latest.toISOString().slice(0, 16);
      setTask((prev) => ({ ...prev, startTime: formatted }));
    }
  }, [task.dependencies, allTasks]);

  //  Submit Task
 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!task.name || !task.duration || !degreeId) {
    showToast("⚠️ Please fill in all required fields.", "error");
    return;
  }

  const payload = {
    name: task.name,
    duration: parseInt(task.duration),
    priority: parseInt(task.priority),
    startTime: task.startTime,
    dependencies: task.dependencies,
    degree: { id: degreeId }, // or use degreeId directly if backend expects it
  };

  console.log("Submitting task payload:", payload); // 🧪 debug

  try {
    const response = await fetch("http://localhost:8080/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      showToast("✅ Task added successfully!", "success");
      setTask({
        name: "",
        duration: "",
        priority: 1,
        startTime: "",
        dependencies: [],
      });
      setRefreshTrigger((prev) => prev + 1);
    } else {
      showToast("⚠️ Failed to add task.", "error");
    }
  } catch (err) {
    console.error("Error submitting task:", err);
    showToast("❌ Error connecting to backend.", "error");
  }
};

  // Toggle dependencies
  const handleDependencyToggle = (id) => {
    const updated = task.dependencies.includes(id)
      ? task.dependencies.filter((depId) => depId !== id)
      : [...task.dependencies, id];
    setTask({ ...task, dependencies: updated });
  };

  // Delete Task
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      const response = await fetch(`http://localhost:8080/api/tasks/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        showToast("🗑️ Task deleted successfully!", "info");
        setRefreshTrigger((prev) => prev + 1);
        setTask((prev) => ({
          ...prev,
          dependencies: prev.dependencies.filter((depId) => depId !== id),
        }));
      } else {
        showToast("⚠️ Failed to delete task.", "error");
      }
    } catch {
      showToast("❌ Backend connection error.", "error");
    }
  };

  const formatTime = (iso) => {
    if (!iso) return "unscheduled";
    const date = new Date(iso);
    return date.toLocaleString("en-US", {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      day: "numeric",
      month: "short",
    });
  };

  // Render UI
  return (
    <>
      <AdminNavbar />

      <div className="flex flex-col justify-start gap-8 px-4 mt-10 ml-64 md:flex-row bg-gradient-to-br from-white/60 via-blue-50/60 to-purple-50/60 min-h-[520px]">
        {/* Left Form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-xl px-5 pt-5 pb-0 overflow-hidden border border-gray-200 shadow-xl bg-gradient-to-br from-indigo-50 to-blue-100 bg-white/80 backdrop-blur-md rounded-2xl"
        >
          <h2 className="flex items-center justify-center mb-3 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
            <FaTasks className="mr-2 text-blue-600" />
            Add New Task
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
            {/* Task Name */}
            <div>
              <label className="flex items-center gap-2 font-medium text-gray-700">
                <FaTasks className="text-blue-500" /> Task Name
              </label>
              <input
                type="text"
                placeholder="Enter task name"
                value={task.name}
                onChange={(e) => setTask({ ...task, name: e.target.value })}
                required
                className="w-full px-3 py-2 mt-1 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="flex items-center gap-2 font-medium text-gray-700">
                <FaClock className="text-indigo-500" /> Duration (hours)
              </label>
              <input
                type="number"
                placeholder="e.g. 2"
                value={task.duration}
                onChange={(e) =>
                  setTask({ ...task, duration: parseInt(e.target.value) })
                }
                required
                className="w-full px-3 py-2 mt-1 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="flex items-center gap-2 font-medium text-gray-700">
                <FaSortAmountUp className="text-purple-500" /> Priority (1 = High)
              </label>
              <input
                type="number"
                value={task.priority}
                onChange={(e) =>
                  setTask({ ...task, priority: parseInt(e.target.value) })
                }
                className="w-full px-3 py-2 mt-1 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400"
              />
            </div>

            {/* Dependencies */}
            <div>
              <label className="flex items-center gap-2 font-medium text-gray-700">
                <FaLink className="text-green-500" /> Select Dependencies
              </label>
              <div className="p-2 mt-1 space-y-1 overflow-y-auto border rounded-lg shadow-sm max-h-40 bg-white/60">
                {availableTasks.length > 0 ? (
                  availableTasks.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between p-1 text-sm rounded hover:bg-indigo-50"
                    >
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          value={t.id}
                          checked={task.dependencies.includes(t.id)}
                          onChange={() => handleDependencyToggle(t.id)}
                        />
                        <span>
                          {t.name} — {t.duration}h @ {formatTime(t.startTime)}
                        </span>
                      </label>
                      <button
                        onClick={() => handleDelete(t.id)}
                        type="button"
                        className="p-1 text-white transition-all bg-red-500 rounded hover:bg-red-600"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No available tasks</p>
                )}
              </div>
            </div>

            {/* Start Time */}
            <div>
              <label className="flex items-center gap-2 font-medium text-gray-700">
                <FaCalendarAlt className="text-pink-500" /> Start Time
              </label>
              <input
                type="datetime-local"
                value={task.startTime}
                onChange={(e) => {
                  if (!hasDependencies) {
                    setTask({ ...task, startTime: e.target.value });
                  }
                }}
                disabled={hasDependencies}
                className={`w-full px-3 py-2 mt-1 border rounded-lg shadow-sm focus:ring-2 ${
                  hasDependencies
                    ? "bg-gray-100 cursor-not-allowed"
                    : "focus:ring-pink-400"
                }`}
              />
              {hasDependencies && (
                <p className="mt-1 text-sm text-gray-500">
                  ⏱ Start time auto-set to the end of latest dependency.
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="mt-3 mb-0">
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="flex items-center justify-center w-full gap-2 px-4 py-2 text-base font-semibold text-white transition-all rounded-lg shadow-md bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:shadow-xl"
              >
                <FaPlusCircle /> Add Task
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Right Side List */}
       <motion.div
  initial={{ opacity: 0, x: 50 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.6 }}
  className="flex-1"
>
  <ViewScheduleList
    badgeSlug={slug} // Pass the badgeSlug here
    refreshTrigger={refreshTrigger}
    onEdit={(task) => setTask(task)} // Optional: sync editing
  />
</motion.div>

      </div>

      {/*  Custom Toast */}
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: "", type: "" })}
        />
      )}
    </>
  );
}

export default AddSchedule;
