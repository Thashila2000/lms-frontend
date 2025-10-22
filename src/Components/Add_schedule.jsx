import React, { useState, useEffect, useMemo } from "react";
import AdminNavbar from "./Admin_navbar";
import ViewScheduleList from "./AdminTaskViewList";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaTasks,
  FaClock,
  FaPlusCircle,
  FaTrashAlt,
  FaLink,
  FaCalendarAlt,
  FaSortAmountUp,
} from "react-icons/fa";

function AddSchedule() {
  const [task, setTask] = useState({
    name: "",
    duration: "",
    priority: 1,
    startTime: "",
    dependencies: [],
  });

  const [allTasks, setAllTasks] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetchTasks();
  }, [refreshTrigger]);

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/tasks");
      const data = await response.json();
      setAllTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("❌ Failed to load tasks.");
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...task };

    try {
      const response = await fetch("http://localhost:8080/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("✅ Task added successfully!");
        setTask({
          name: "",
          duration: "",
          priority: 1,
          startTime: "",
          dependencies: [],
        });
        setRefreshTrigger((prev) => prev + 1);
      } else {
        toast.error("⚠️ Failed to add task.");
      }
    } catch (error) {
      console.error("Error submitting task:", error);
      toast.error("❌ Error connecting to backend.");
    }
  };

  const handleDependencyToggle = (id) => {
    const updated = task.dependencies.includes(id)
      ? task.dependencies.filter((depId) => depId !== id)
      : [...task.dependencies, id];
    setTask({ ...task, dependencies: updated });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this task?");
    if (!confirmed) return;

    try {
      const response = await fetch(`http://localhost:8080/api/tasks/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.info("🗑️ Task deleted.");
        await fetchTasks();
        setTask((prev) => ({
          ...prev,
          dependencies: prev.dependencies.filter((depId) => depId !== id),
        }));
      } else {
        toast.error("⚠️ Failed to delete task.");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("❌ Backend connection error.");
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

  return (
    <>
      <AdminNavbar />

      <div className="flex flex-col justify-center min-h-screen gap-8 px-4 mt-24 ml-64 md:flex-row bg-gradient-to-br from-white/60 via-blue-50/60 to-purple-50/60">
        {/* Left Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-xl p-8 border border-gray-200 shadow-xl bg-white/80 backdrop-blur-md rounded-2xl"
        >
          <h2 className="flex items-center justify-center mb-6 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
            <FaTasks className="mr-2 text-blue-600" />
            Add New Task
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
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
              <label className="flex items-center gap-2 mt-4 font-medium text-gray-700">
                <FaLink className="text-green-500" /> Select Dependencies
              </label>
              <div className="p-2 mt-2 space-y-2 overflow-y-auto border rounded-lg shadow-sm max-h-40 bg-white/60">
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
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="flex items-center justify-center w-full gap-2 px-4 py-2 text-white transition-all rounded-lg shadow-md bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:shadow-xl"
            >
              <FaPlusCircle />
              Add Task
            </motion.button>
          </form>
        </motion.div>

        {/* Right Side List */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1"
        >
          <ViewScheduleList refreshTrigger={refreshTrigger} />
        </motion.div>
      </div>

      <ToastContainer position="bottom-right" autoClose={4000} />
    </>
  );
}

export default AddSchedule;
