import React, { useEffect, useState } from "react";
import StudentNavbar from "./StudentNavbar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import {
  FaClipboardList,
  FaClock,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
} from "react-icons/fa";

function ViewSchedule() {
  const indexNumber = localStorage.getItem("studentIndex");
  const [tasks, setTasks] = useState([]);
  const [tick, setTick] = useState(0);
  const [shownTasks, setShownTasks] = useState([]);

  useEffect(() => {
    const fetchSchedule = async () => {
      if (!indexNumber) return;

      try {
        const degreeRes = await fetch(`http://localhost:8080/api/auth/degree?indexNumber=${indexNumber}`);
        const degreeId = await degreeRes.json();

        if (!degreeId || typeof degreeId !== "number") {
          toast.error("⚠️ Failed to load your degree. Please contact admin.");
          return;
        }

        const taskRes = await fetch(`http://localhost:8080/api/tasks/schedule?degreeId=${degreeId}`);
        const taskData = await taskRes.json();

        if (Array.isArray(taskData)) {
          const sorted = [...taskData].sort(
            (a, b) => new Date(a.computedStart) - new Date(b.computedStart)
          );
          setTasks(sorted);
        } else {
          console.error("Expected array but got:", taskData);
          setTasks([]);
        }
      } catch (error) {
        console.error("Error fetching schedule:", error);
        setTasks([]);
      }
    };

    fetchSchedule();
  }, [indexNumber]);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const now = new Date();
    tasks.forEach((task) => {
      const start = new Date(task.computedStart);
      const end = new Date(task.computedEnd);
      const isActive = now >= start && now < end;
      const notShown = !shownTasks.includes(task.id);

      if (isActive && notShown) {
        toast.info(`🕒 Task "${task.name}" is now available for submission`, {
          toastId: `task-${task.id}`,
        });
        setShownTasks((prev) => [...prev, task.id]);
      }
    });
  }, [tick, tasks, shownTasks]);

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

  const isTaskSubmittable = (startIso) => {
    if (!startIso) return false;
    const now = new Date();
    const start = new Date(startIso);
    return now >= start;
  };

  const isTaskExpired = (endIso) => {
    if (!endIso) return false;
    const now = new Date();
    const end = new Date(endIso);
    return now > end;
  };

  const getStatusLabel = (task) => {
    const isExpired = isTaskExpired(task.computedEnd);
    const canSubmit = isTaskSubmittable(task.computedStart);

    if (isExpired) return { label: "Expired", style: "bg-gray-300 text-gray-600" };
    if (canSubmit) return { label: "Active", style: "bg-green-100 text-green-700" };
    return { label: "Upcoming", style: "bg-yellow-100 text-yellow-700" };
  };

  const handleSubmit = (task) => {
    console.log(`Submitted task: ${task.name}`, task);
    toast.success(`✅ Task "${task.name}" submitted successfully`);
  };

  return (
    <>
      <StudentNavbar />

      <div className="min-h-screen px-6 pt-24 pb-12 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-5xl p-8 mx-auto -mt-20 border shadow-2xl bg-white/80 backdrop-blur-lg border-white/40 rounded-3xl"
        >
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center mb-20 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"
          >
            <FaClipboardList className="mr-3 text-blue-600" />
            Scheduled Tasks
          </motion.h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {tasks.length === 0 ? (
              <p className="col-span-2 text-center text-gray-500">No tasks scheduled.</p>
            ) : (
              tasks.map((task, index) => {
                const _ = tick;
                const canSubmit = isTaskSubmittable(task.computedStart);
                const isExpired = isTaskExpired(task.computedEnd);
                const status = getStatusLabel(task);

                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.03 }}
                    className={`p-5 rounded-2xl transition-all shadow-lg border ${
                      isExpired
                        ? "bg-white/70 border-gray-200"
                        : "bg-gradient-to-br from-blue-100/70 via-indigo-100/70 to-purple-100/70 border-blue-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                        <FaClipboardList className="text-indigo-600" />
                        {task.name}
                      </h3>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${status.style}`}>
                        {status.label}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-gray-700">
                      <p className="flex items-center gap-2">
                        <FaClock className="text-indigo-500" />
                        Duration: <span className="font-medium">{task.duration}h</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <FaCalendarAlt className="text-blue-500" />
                        Start: {formatTime(task.computedStart)}
                      </p>
                      <p className="flex items-center gap-2">
                        <FaCalendarAlt className="text-purple-500" />
                        End: {formatTime(task.computedEnd)}
                      </p>
                    </div>

                    <div className="mt-4 text-right">
                      {!isExpired && (
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSubmit(task)}
                          disabled={!canSubmit}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-md ${
                            canSubmit
                              ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg"
                              : "bg-gray-300 text-gray-600 cursor-not-allowed"
                          }`}
                        >
                          Submit Task
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>

      <ToastContainer position="bottom-right" autoClose={5000} />
    </>
  );
}

export default ViewSchedule;