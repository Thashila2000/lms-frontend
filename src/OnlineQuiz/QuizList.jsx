import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaClipboardList, FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import StudentNavbar from "../Components/StudentNavbar";

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [message, setMessage] = useState("");
  const studentIndex = localStorage.getItem("studentIndex");
  const navigate = useNavigate();

  useEffect(() => {
    if (!studentIndex) {
      setMessage("❌ Please log in to see available quizzes.");
      return;
    }

    const fetchQuizzes = async () => {
  try {
    const res = await fetch(`http://localhost:8080/api/online-quizzes/list/${studentIndex}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setQuizzes(data);
      } else {
        setMessage("⚠️ No quizzes available at the moment.");
      }
    } else {
      // 👇 read the error body and show its message
      const errData = await res.json();
      setMessage(errData.message || "⚠️ No quizzes available at the moment.");
    }
  } catch (err) {
    console.error(err);
    setMessage("❌ Error fetching quizzes.");
  }
};

    fetchQuizzes();
  }, [studentIndex]);

const formatTime = (iso) => {
  if (!iso) return "unscheduled";
  const date = new Date(iso);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
  const handleQuizClick = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };

  return (
    <>
      <StudentNavbar />
      <div className="min-h-screen px-6 pt-24 pb-16 bg-gradient-to-br from-white via-indigo-50 to-purple-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-4xl p-6 mx-auto bg-white rounded-lg shadow-md"
        >
          <h2 className="mb-6 text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            <FaClipboardList className="inline-block mr-2 text-indigo-600" />
            Available Quizzes
          </h2>

          {message && <p className="text-center text-gray-600">{message}</p>}

          <div className="space-y-4">
            {quizzes.map((quiz) => (
              <motion.div
                key={quiz.id}
                whileHover={{ scale: 1.02 }}
                className="p-4 border rounded-md shadow-sm cursor-pointer bg-gray-50 hover:bg-indigo-50"
                onClick={() => handleQuizClick(quiz.id)}
              >
                <h3 className="text-lg font-semibold text-gray-800">{quiz.title}</h3>
                <p className="flex items-center gap-2 text-sm text-gray-600">
                  <FaCalendarAlt className="text-blue-500" /> Start: {formatTime(quiz.startTime)}
                </p>
                <p className="flex items-center gap-2 text-sm text-gray-600">
                  <FaCalendarAlt className="text-purple-500" /> End: {formatTime(quiz.endTime)}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default QuizList;